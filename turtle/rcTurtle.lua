-- github: https://github.com/exa-byte/CCTurtleRemoteController
os.loadAPI("tapi")

local get_command_url = tapi.url .. "getCommand/"
local get_stop_signal_url = tapi.url .. "getStopSignal/"
local command_result_url = tapi.url .. "commandResult/"

function send_command_result(succ, ret)
    local valid, cmd_result = pcall(textutils.serializeJSON, { turtleId = os.getComputerID(), result = { succ = succ, ret = ret } })
    if not valid then
        cmd_result = textutils.serializeJSON({ turtleId = os.getComputerID(), result = { succ = false, ret = "error: result contains function which cannot be serialized" } })
    end
    -- print("sending cmd_result: " .. tostring(succ) .. ", " .. tostring(ret))
    local res = http.post(command_result_url, cmd_result, { ["Content-Type"] = "application/json" })
    if res then --[[print(res.readAll())]] res.close() end
    print(tapi.getLoc())
end

function get_command()
    local json = textutils.serializeJSON({ id = os.getComputerID() })
    local res = http.post(get_command_url, json, { ["Content-Type"] = "application/json" })
    if res then
        local cmd_string = res.readAll()
        if cmd_string == "" then res.close(); return end
        local cmd, err = loadstring(cmd_string)
        if cmd then
            if #cmd_string > 0 then print("executing cmd: " .. cmd_string) end
            setfenv(cmd, getfenv())
            send_command_result(pcall(cmd))
        else
            print("error in loadstring(" .. cmd_string .. ")");
            send_command_result(false, err)
        end
        res.close()
    end
end

function poll_stop_signal()
    while true do
        local json = textutils.serializeJSON({ id = os.getComputerID() })
        local res = http.post(get_stop_signal_url, json, { ["Content-Type"] = "application/json" })
        if res then
            local stop_string = res.readAll()
            if string.find(stop_string, "true") then
                res.close()
                print("got stop signal!")                
                tapi.locSemaphore.stopSignal = true
                while tapi.locSemaphore.count > 0 do os.sleep(0.001) end
                return
            end
            res.close()
        end
        os.sleep(1)
    end
end

function main()
    while true do
        tapi.send_status_update()
        parallel.waitForAny(poll_stop_signal, get_command)
        tapi.locSemaphore.stopSignal = false
    end
end

main()

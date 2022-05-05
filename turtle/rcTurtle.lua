-- github: https://github.com/exa-byte/CCTurtleRemoteController
os.loadAPI("tapi")

local get_command_url = tapi.url .. "getCommand/"
local command_result_url = tapi.url .. "commandResult/"

function send_command_result(succ, ret)
    local cmd_result = textutils.serializeJSON({succ=succ, ret=ret})
    -- print("sending cmd_result: " .. tostring(succ) .. ", " .. tostring(ret))
    local res = http.post(command_result_url, cmd_result, {["Content-Type"] = "application/json"})
    if res then --[[print(res.readAll())]] res.close() end
    print(tapi.getLoc())
end

-- legacy code compat (tapi move functions include status update)
function send_status_update() end

function get_command()
    json = textutils.serializeJSON({id=os.getComputerID()})
    local res = http.post(get_command_url, json, {["Content-Type"] = "application/json"})
    if res then
        local cmd_string = res.readAll()
        local cmd, err = loadstring(cmd_string)
        if cmd then
            if #cmd_string > 0 then print("executing cmd: " .. cmd_string) end
            setfenv(cmd, getfenv())
            send_command_result(pcall(cmd))
        else
            print("error in loadstring("..cmd_string..")");
            send_command_result(false, err)
        end
        res.close()
    end
end

function main()
    while true do
        tapi.send_status_update()
        get_command()
    end
end

main()


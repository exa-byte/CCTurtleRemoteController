const fs = require('fs');
const archiver = require('archiver');

const zipFolder = (sourceFolders, outputPath) => {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log('Zip archive created successfully.');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  sourceFolders.forEach((folder) => {
    archive.glob(folder);
  });

  binaries.forEach((folder) => {
    archive.directory(folder, false);
  });

  archive.finalize();
};

const assets = [
  'dist/**/*',
  'textures/turtle/**/*',
  'textures/**/.gitkeep',
  'turtle/**/*',
  'src/turtlePrograms/**/*',
];
const binaries = [
  'packaged/'
]
const outputPath = 'packagedZip/cc-remote-controller-1.2.0.zip';

if (!fs.existsSync('packagedZip')) {
  fs.mkdirSync('packagedZip');
}

console.log('Packaging will take some time...')
zipFolder(assets, outputPath); 
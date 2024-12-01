const fs = require('fs');
const path = require('path');

const directoriesToClean = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'package-lock.json'),
  path.resolve(__dirname, 'frontend', 'node_modules'),
  path.resolve(__dirname, 'frontend', 'package-lock.json'),
  path.resolve(__dirname, 'backend', 'node_modules'),
  path.resolve(__dirname, 'backend', 'package-lock.json'),
];

directoriesToClean.forEach((dir) => {
  try {
    if (fs.existsSync(dir)) {
      if (fs.lstatSync(dir).isDirectory()) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Deleted directory: ${dir}`);
      } else {
        fs.unlinkSync(dir);
        console.log(`Deleted file: ${dir}`);
      }
    } else {
      console.log(`Path does not exist: ${dir}`);
    }
  } catch (error) {
    console.error(`Error deleting ${dir}:`, error.message);
  }
});

console.log('Cleanup completed successfully!');

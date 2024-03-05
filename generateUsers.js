const faker = require('faker');
const fs = require('fs');
const path = require('path');
const startTime = new Date();

const outputDir = path.join(__dirname, 'output'); // 定义输出目录路径

// 检查output目录是否存在，如果不存在则创建
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// 添加一个参数generateCSV来决定生成的文件格式
const generateAndSaveUsers = async (numUsers, generateCSV) => {
    const extension = generateCSV ? 'csv' : 'sql';
    const fileName = `users.${extension}`;
    const writeStream = fs.createWriteStream(path.join(outputDir, fileName));

    writeStream.on('finish', () => {
        const endTime = new Date(); // 记录结束时间
        const timeDiff = (endTime - startTime) / 1000; // 计算耗时（秒）
        console.log(`Execution time: ${timeDiff} seconds`);
        console.log(`Data successfully saved to ${path.join(outputDir, fileName)}`);
    });

    // 如果是CSV格式，首先写入表头
    if (generateCSV) {
        writeStream.write('username,password,email,created_at\n');
    }

    for (let id = 1; id <= numUsers; id++) {
        const related = Math.random() < 0.5;
        const username = faker.internet.userName();
        const password = faker.internet.password();
        const email = related ? `${username.toLowerCase()}@example.com` : faker.internet.email();
        const createdAt = faker.date.past().toISOString().slice(0, 19).replace('T', ' ');

        let dataLine;
        if (generateCSV) {
            // 生成CSV格式的数据行
            dataLine = `"${username}","${password}","${email}","${createdAt}"\n`;
        } else {
            // 生成SQL插入语句
            dataLine = `INSERT INTO users (username, password, email, created_at) VALUES ('${username}', '${password}', '${email}', '${createdAt}');\n`;
        }

        // 检查写入流是否已满
        if (!writeStream.write(dataLine)) {
            // 如果流已满，等待'drain'事件再继续写入
            await new Promise(resolve => writeStream.once('drain', resolve));
        }
    }

    writeStream.end(); // 完成写入
};

(async () => {
    const numUsers = 25000000;
    // 通过更改这里的true或false来决定生成的是CSV文件还是SQL文件
    await generateAndSaveUsers(numUsers, true); // 生成CSV文件
    // await generateAndSaveUsers(numUsers, false); // 生成SQL文件
})();



// // 1万条, 时间:0.064秒， 文件体积: 15:22G
// // 10万条, 时间:0.5秒， 文件体积: 15.3M
// // 100万条, 时间:4.9秒， 文件体积: 152M
// // 1000万条, 时间:50秒， 文件体积: 1.5G
// // 1亿条, 时间:568秒， 文件体积: 15.22G


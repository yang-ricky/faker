const faker = require('faker');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output'); // 定义输出目录路径

// 检查output目录是否存在，如果不存在则创建
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

const startTime = new Date();
//const writeStream = fs.createWriteStream('coupons.sql');

// 配置选项：设置为true生成CSV，设置为false生成SQL
const generateCSV = true;

// 根据配置选择文件名和写入流
const fileName = generateCSV ? 'coupons.csv' : 'coupons.sql';
const writeStream = fs.createWriteStream(path.join(outputDir, fileName), { encoding: 'utf8' });

// 如果是CSV格式，写入表头
if (generateCSV) {
    const headers = 'code,percentage_off,valid_from,valid_until\n';
    writeStream.write(headers);
}


const generateCoupons = async (numCoupons) => {
    for (let i = 1; i <= numCoupons; i++) {
        const code = faker.random.alphaNumeric(10).toUpperCase();
        const percentageOff = faker.datatype.number({ min: 5, max: 75 });
        const validFrom = faker.date.past(1).toISOString().slice(0, 19).replace('T', ' ');
        const validUntil = faker.date.future(1).toISOString().slice(0, 19).replace('T', ' ');

        if (generateCSV) {
            // 生成CSV格式的数据
            const couponData = `"${code}",${percentageOff},"${validFrom}","${validUntil}"\n`;
            writeStream.write(couponData);
        } else {
            // 生成SQL插入语句
            const couponData = `INSERT INTO coupons (code, percentage_off, valid_from, valid_until) VALUES ('${code}', ${percentageOff}, '${validFrom}', '${validUntil}');\n`;
            writeStream.write(couponData);
        }
    }
    writeStream.end();
};


generateCoupons(1000000); // Generate 10,000 coupons

writeStream.on('finish', () => {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // Calculate execution time in seconds
    console.log('Coupons data successfully saved to coupons.sql');
    console.log(`Execution time: ${timeDiff} seconds`);
});


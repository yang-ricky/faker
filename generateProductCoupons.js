// const faker = require('faker');
// const fs = require('fs');

// const startTime = new Date();
// const writeStream = fs.createWriteStream('product_coupons.sql');

// const outputDir = path.join(__dirname, 'output'); // 定义输出目录路径

// // 检查output目录是否存在，如果不存在则创建
// if (!fs.existsSync(outputDir)){
//     fs.mkdirSync(outputDir, { recursive: true });
// }

// const generateProductCoupons = (numProductCoupons, numProducts, numCoupons) => {
//     for (let i = 1; i <= numProductCoupons; i++) {
//         const productId = faker.datatype.number({ min: 1, max: numProducts });
//         const couponId = faker.datatype.number({ min: 1, max: numCoupons });
//         const couponData = `INSERT INTO product_coupons (product_id, coupon_id) VALUES (${productId}, ${couponId});\n`;

//         // 直接写入每个product_coupon的数据
//         writeStream.write(couponData);
//     }
//     writeStream.end();
// };

// generateProductCoupons(500000, 5000000, 1000000); // Generate 50,000 product_coupons for 100,000 products and 10,000 coupons

// writeStream.on('finish', () => {
//     const endTime = new Date();
//     const timeDiff = (endTime - startTime) / 1000; // Calculate execution time in seconds
//     console.log('Product coupons data successfully saved to product_coupons.sql');
//     console.log(`Execution time: ${timeDiff} seconds`);
// });

const faker = require('faker');
const fs = require('fs');
const path = require('path');

const startTime = new Date();

const outputDir = path.join(__dirname, 'output'); // 定义输出目录路径

// 检查output目录是否存在，如果不存在则创建
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// 配置选项：设置为true生成CSV，设置为false生成SQL
const generateCSV = true; // 可以根据需要修改这里以切换格式

// 根据配置选择文件名和写入流
const fileName = generateCSV ? 'product_coupons.csv' : 'product_coupons.sql';
const writeStream = fs.createWriteStream(path.join(outputDir, fileName), { encoding: 'utf8' });

// 如果是CSV格式，写入表头
if (generateCSV) {
    const headers = 'product_id,coupon_id\n';
    writeStream.write(headers);
}

const generateProductCoupons = (numProductCoupons, numProducts, numCoupons) => {
    for (let i = 1; i <= numProductCoupons; i++) {
        const productId = faker.datatype.number({ min: 1, max: numProducts });
        const couponId = faker.datatype.number({ min: 1, max: numCoupons });

        if (generateCSV) {
            // 生成CSV格式的数据
            const couponData = `${productId},${couponId}\n`;
            writeStream.write(couponData);
        } else {
            // 生成SQL插入语句
            const couponData = `INSERT INTO product_coupons (product_id, coupon_id) VALUES (${productId}, ${couponId});\n`;
            writeStream.write(couponData);
        }
    }
    writeStream.end();
};

generateProductCoupons(500000, 5000000, 1000000); // Generate 500,000 product_coupons for 5,000,000 products and 1,000,000 coupons

writeStream.on('finish', () => {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // Calculate execution time in seconds
    console.log(`Product coupons data successfully saved to ${fileName}`);
    console.log(`Execution time: ${timeDiff} seconds`);
});


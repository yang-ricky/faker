// const faker = require('faker');
// const fs = require('fs');
// const path = require('path');

// const startTime = new Date();
// const writeStream = fs.createWriteStream('reviews.sql');

// const outputDir = path.join(__dirname, 'output'); // 定义输出目录路径

// // 检查output目录是否存在，如果不存在则创建
// if (!fs.existsSync(outputDir)){
//     fs.mkdirSync(outputDir, { recursive: true });
// }

// const generateReviewData = (i) => {
//     const productId = faker.datatype.number({ min: 1, max: 100000 });
//     const userId = faker.datatype.number({ min: 1, max: 400000 });
//     const rating = faker.datatype.number({ min: 1, max: 5 });
//     const comment = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })).replace(/'/g, "''");
//     const createdAt = faker.date.past(2).toISOString().slice(0, 19).replace('T', ' ');
//     return `INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES (${productId}, ${userId}, ${rating}, '${comment}', '${createdAt}');\n`;
// };

// const generateReviews = (numReviews) => {
//     let i = 1;
//     const writeData = () => {
//         let ok = true;
//         while (i <= numReviews && ok) {
//             const reviewData = generateReviewData(i);
//             if (i === numReviews) {
//                 writeStream.write(reviewData, 'utf8', () => {
//                     writeStream.end(); // Ensure to call end after the last write
//                 });
//             } else {
//                 ok = writeStream.write(reviewData);
//             }
//             i++;
//         }
//         if (i <= numReviews) {
//             // If the stream said it is not ok to write, we wait for 'drain' to write again
//             writeStream.once('drain', writeData);
//         }
//     };

//     writeData();
// };

// writeStream.on('finish', () => {
//     const endTime = new Date();
//     const timeDiff = (endTime - startTime) / 1000; // Calculate execution time in seconds
//     console.log(`Reviews data successfully saved to reviews.sql`);
//     console.log(`Execution time: ${timeDiff} seconds`);
// });

// generateReviews(1000000); // Generate 100,000 reviews

const faker = require('faker');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'output'); // 定义输出目录路径

// 检查output目录是否存在，如果不存在则创建
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

const startTime = new Date();

// 配置选项：设置为true生成CSV，设置为false生成SQL
const generateCSV = true; // 可以根据需要修改这里以切换格式

// 根据配置选择文件名和写入流
const fileName = generateCSV ? 'reviews.csv' : 'reviews.sql';
const writeStream = fs.createWriteStream(path.join(outputDir, fileName), { encoding: 'utf8' });

// 如果是CSV格式，写入表头
if (generateCSV) {
    const headers = 'product_id,user_id,rating,comment,created_at\n';
    writeStream.write(headers);
}

const generateReviewData = (i) => {
    const productId = faker.datatype.number({ min: 1, max: 100000 });
    const userId = faker.datatype.number({ min: 1, max: 400000 });
    const rating = faker.datatype.number({ min: 1, max: 5 });
    const comment = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })).replace(/'/g, "''");
    const createdAt = faker.date.past(2).toISOString().slice(0, 19).replace('T', ' ');

    if (generateCSV) {
        // 生成CSV格式的数据
        return `${productId},${userId},${rating},"${comment}","${createdAt}"\n`;
    } else {
        // 生成SQL插入语句
        return `INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES (${productId}, ${userId}, ${rating}, '${comment}', '${createdAt}');\n`;
    }
};

const generateReviews = (numReviews) => {
    let i = 1;
    const writeData = () => {
        let ok = true;
        while (i <= numReviews && ok) {
            const reviewData = generateReviewData(i);
            if (i === numReviews) {
                writeStream.write(reviewData, 'utf8', () => {
                    writeStream.end(); // Ensure to call end after the last write
                });
            } else {
                ok = writeStream.write(reviewData);
            }
            i++;
        }
        if (i <= numReviews) {
            // If the stream said it is not ok to write, we wait for 'drain' to write again
            writeStream.once('drain', writeData);
        }
    };

    writeData();
};

writeStream.on('finish', () => {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // Calculate execution time in seconds
    console.log(`Reviews data successfully saved to ${fileName}`);
    console.log(`Execution time: ${timeDiff} seconds`);
});

generateReviews(2000000); // Generate 1,000,000 reviews




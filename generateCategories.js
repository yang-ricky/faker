// const faker = require('faker');
// const fs = require('fs');
// const path = require('path');

// const startTime = new Date();
// const outputDir = path.join(__dirname, 'output'); // 定义输出目录路径

// // 检查output目录是否存在，如果不存在则创建
// if (!fs.existsSync(outputDir)){
//     fs.mkdirSync(outputDir, { recursive: true });
// }

// const categoryNames = new Set(); // 使用Set来存储唯一的类别名称
// while (categoryNames.size < 22) { // 假设我们想要生成22个唯一的类别
//     categoryNames.add(faker.commerce.department());
// }

// const generateCategories = (categoryNames) => {
//     const categories = [];
//     let id = 1;
//     for (const name of categoryNames) {
//         // 前10个设置为顶级类别
//         const parentId = id > 10 ? Math.floor(Math.random() * 10) + 1 : null;
//         categories.push({ id, name, parentId });
//         id++;
//     }
//     return categories;
// };

// const categoriesData = generateCategories(categoryNames);

// const writeStream = fs.createWriteStream(path.join(outputDir, 'categories.sql'));
// writeStream.write('INSERT INTO categories (category_id, name, parent_id) VALUES\n');

// categoriesData.forEach((category, index) => {
//     const parentId = category.parentId === null ? 'NULL' : category.parentId;
//     writeStream.write(`(${category.id}, '${category.name.replace(/'/g, "''")}', ${parentId})${index === categoriesData.length - 1 ? ';' : ',\n'}`);
// });

// writeStream.end();
// writeStream.on('finish', () => {
//     const endTime = new Date();
//     const timeDiff = (endTime - startTime) / 1000; // 计算耗时（秒）
//     console.log(`Categories data successfully saved to ${path.join(outputDir, 'categories.sql')}`);
//     console.log(`Execution time: ${timeDiff} seconds`);
// });


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
const generateCSV = true;

// 根据配置选择文件名和写入流
const fileName = generateCSV ? 'categories.csv' : 'categories.sql';
const writeStream = fs.createWriteStream(path.join(outputDir, fileName), { encoding: 'utf8' });

// 如果是CSV格式，写入表头
if (generateCSV) {
    const headers = 'category_id,name,parent_id\n';
    writeStream.write(headers);
}

const categoryNames = new Set(); // 使用Set来存储唯一的类别名称
while (categoryNames.size < 22) { // 假设我们想要生成22个唯一的类别
    categoryNames.add(faker.commerce.department());
}

const generateCategories = (categoryNames) => {
    const categories = [];
    let id = 1;
    for (const name of categoryNames) {
        // 前10个设置为顶级类别
        const parentId = id > 10 ? Math.floor(Math.random() * 10) + 1 : null;
        categories.push({ id, name, parentId });
        id++;
    }
    return categories;
};

const categoriesData = generateCategories(categoryNames);

categoriesData.forEach((category, index) => {
    const parentId = category.parentId === null ? '' : category.parentId; // 修改这里
    if (generateCSV) {
        // 生成CSV格式的数据，对于null的parentId，直接留空
        const categoryData = `${category.id},"${category.name}",${parentId}\n`;
        writeStream.write(categoryData);
    } else {
        // 生成SQL插入语句
        const categoryData = `INSERT INTO categories (category_id, name, parent_id) VALUES (${category.id}, '${category.name.replace(/'/g, "''")}', ${parentId === '' ? 'NULL' : parentId})${index === categoriesData.length - 1 ? ';' : ',\n'}`;
        writeStream.write(categoryData);
    }
});


writeStream.end();
writeStream.on('finish', () => {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // 计算耗时（秒）
    console.log(`Categories data successfully saved to ${path.join(outputDir, fileName)}`);
    console.log(`Execution time: ${timeDiff} seconds`);
});


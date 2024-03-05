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
const generateCSV = true;

// 根据配置选择文件名和写入流
const fileName = generateCSV ? 'products.csv' : 'products.sql';
const writeStream = fs.createWriteStream(path.join(outputDir, fileName));

// 如果是CSV格式，写入表头
if (generateCSV) {
    const headers = 'product_id,name,description,price,stock,category_id,created_at\n';
    writeStream.write(headers);
}

const categories = [
    { id: 1, name: 'Toys' },
    { id: 2, name: 'Automotive' },
    { id: 3, name: 'Beauty' },
    { id: 4, name: 'Books' },
    { id: 5, name: 'Baby' },
    { id: 6, name: 'Grocery' },
    { id: 7, name: 'Garden' },
    { id: 8, name: 'Clothing' },
    { id: 9, name: 'Electronics' },
    { id: 10, name: 'Jewelery' },
    { id: 11, name: 'Games' }, // 假设是Electronics的子类别
    { id: 12, name: 'Kids' }, // 假设是Jewelery的子类别
    { id: 13, name: 'Music' }, // 假设是Garden的子类别
    { id: 14, name: 'Movies' }, // 假设是Beauty的子类别
    { id: 15, name: 'Health' }, // 假设是Clothing的子类别
    { id: 16, name: 'Shoes' }, // 假设是Electronics的子类别
    { id: 17, name: 'Computers' }, // 假设是Garden的子类别
    { id: 18, name: 'Sports' }, // 假设是Clothing的子类别
    { id: 19, name: 'Outdoors' }, // 假设是Garden的子类别
    { id: 20, name: 'Tools' }, // 假设是Garden的子类别
    { id: 21, name: 'Home' }, // 假设是Toys的子类别
    { id: 22, name: 'Industrial' } // 假设是Grocery的子类别
];

const getCategoryDescription = (categoryId) => {
    const category = categories.find(category => category.id === categoryId);
    if (!category) return "No description available.";

    let description;

    switch (category.name) {
        case 'Toys': 
            description = faker.commerce.productAdjective() + " toy"; 
            break;
        case 'Automotive': 
            description = faker.commerce.productAdjective() + " automotive accessory"; 
            break;
        case 'Beauty': 
            description = faker.commerce.productAdjective() + " beauty product"; 
            break;
        case 'Books': 
            description = "Interesting " + faker.commerce.productAdjective() + " book"; 
            break;
        case 'Baby': 
            description = "Soft " + faker.commerce.productAdjective() + " baby item"; 
            break;
        case 'Grocery': 
            description = "Delicious " + faker.commerce.productAdjective() + " grocery item"; 
            break;
        case 'Garden': 
            description = faker.commerce.productAdjective() + " garden tool"; 
            break;
        case 'Clothing': 
            description = "Fashionable " + faker.commerce.productAdjective() + " clothing"; 
            break;
        case 'Electronics': 
            description = "Latest " + faker.commerce.productAdjective() + " electronics"; 
            break;
        case 'Jewelery': 
            description = "Exquisite " + faker.commerce.productAdjective() + " jewelry"; 
            break;
        case 'Games': 
            description = "Fun " + faker.commerce.productAdjective() + " game for all ages"; 
            break;
        case 'Kids': 
            description = faker.commerce.productAdjective() + " kids' item"; 
            break;
        case 'Music': 
            description = "Soothing " + faker.commerce.productAdjective() + " music album"; 
            break;
        case 'Movies': 
            description = "Exciting " + faker.commerce.productAdjective() + " movie"; 
            break;
        case 'Health': 
            description = "Healthy " + faker.commerce.productAdjective() + " health product"; 
            break;
        case 'Shoes': 
            description = "Comfortable " + faker.commerce.productAdjective() + " shoes"; 
            break;
        case 'Computers': 
            description = "High-performance " + faker.commerce.productAdjective() + " computer"; 
            break;
        case 'Sports': 
            description = faker.commerce.productAdjective() + " sports equipment"; 
            break;
        case 'Outdoors': 
            description = faker.commerce.productAdjective() + " outdoor gear"; 
            break;
        case 'Tools': 
            description = "Durable " + faker.commerce.productAdjective() + " tools"; 
            break;
        case 'Home': 
            description = "Cozy " + faker.commerce.productAdjective() + " home accessory"; 
            break;
        case 'Industrial': 
            description = "Heavy-duty " + faker.commerce.productAdjective() + " industrial equipment"; 
            break;
        default: 
            description = faker.commerce.productDescription();
    }

    // 对description中的单引号进行转义
    return description.replace(/'/g, "''");
};


const generateProductData = (id) => {
    const categoryId = faker.datatype.number({ min: 1, max: 22 });
    const name = faker.commerce.productName().replace(/,/g, ''); // 移除名称中的逗号，避免CSV格式冲突
    const description = getCategoryDescription(categoryId).replace(/,/g, ''); // 同上
    const price = faker.commerce.price();
    const stock = faker.datatype.number({ min: 0, max: 100 });
    const createdAt = faker.date.past().toISOString().slice(0, 19).replace('T', ' ');

    if (generateCSV) {
        // 生成CSV格式的数据
        return `${id},"${name}","${description}",${price},${stock},${categoryId},"${createdAt}"\n`;
    } else {
        // 生成SQL插入语句
        return `INSERT INTO products (product_id, name, description, price, stock, category_id, created_at) VALUES (${id}, '${name}', '${description}', ${price}, ${stock}, ${categoryId}, '${createdAt}');\n`;
    }
};


const generateProducts = (numProducts) => {
    for (let id = 1; id <= numProducts; id++) {
        const productData = generateProductData(id);
        writeStream.write(productData);
    }
    writeStream.end();
};

writeStream.on('finish', () => {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // 计算耗时（秒）
    console.log('Products data successfully saved to products.sql');
    console.log(`Execution time: ${timeDiff} seconds`);
});

generateProducts(5000000); 

const faker = require('faker');
const fs = require('fs');
const path = require('path');

const startTime = new Date();
const outputDir = path.join(__dirname, 'output');

// 检查output目录是否存在，如果不存在则创建
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 配置选项：设置为true生成CSV，设置为false生成SQL
const generateCSV = true; // 可以根据需要修改这里以切换格式

// 创建数据流到output目录下的文件
const ordersFileName = generateCSV ? 'orders.csv' : 'orders.sql';
const detailsFileName = generateCSV ? 'order_details.csv' : 'order_details.sql';
const paymentFileName = generateCSV ? 'payment_info.csv' : 'payment_info.sql';

const ordersStream = fs.createWriteStream(path.join(outputDir, ordersFileName));
const detailsStream = fs.createWriteStream(path.join(outputDir, detailsFileName));
const paymentStream = fs.createWriteStream(path.join(outputDir, paymentFileName));

if (generateCSV) {
    // 如果是CSV格式，写入表头
    ordersStream.write('order_id,user_id,total_price,status,created_at\n');
    detailsStream.write('order_id,product_id,quantity,price\n');
    paymentStream.write('order_id,payment_method,paid_amount,paid_at\n');
}

const numUsers = 25000000; // 假定的用户
const numProducts = 5000000; // 假定的商品

const generateData = (numOrders) => {
    for (let i = 1; i <= numOrders; i++) {
        const userId = faker.datatype.number({ min: 1, max: numUsers });
        const createdAt = faker.date.past(1).toISOString().slice(0, 19).replace('T', ' ');
        let totalAmount = 0;

        const numItems = faker.datatype.number({ min: 1, max: 6 });
        
        for (let j = 0; j < numItems; j++) {
            const productId = faker.datatype.number({ min: 1, max: numProducts });
            const quantity = faker.datatype.number({ min: 1, max: 5 });
            const price = parseFloat(faker.commerce.price());
            totalAmount += quantity * price;
            
            if (generateCSV) {
                // 生成CSV格式的数据
                detailsStream.write(`${i},${productId},${quantity},${price}\n`);
            } else {
                // 生成SQL插入语句
                detailsStream.write(`INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (${i}, ${productId}, ${quantity}, ${price});\n`);
            }
        }

        const orderStatus = ['CREATED', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'][faker.datatype.number({ min: 0, max: 4 })];

        if (generateCSV) {
            // 生成CSV格式的数据
            ordersStream.write(`${i},${userId},${totalAmount.toFixed(2)},${orderStatus},${createdAt}\n`);
        } else {
            // 生成SQL插入语句
            ordersStream.write(`INSERT INTO orders (order_id, user_id, total_price, status, created_at) VALUES (${i}, ${userId}, ${totalAmount.toFixed(2)}, '${orderStatus}', '${createdAt}');\n`);
        }

        const paymentMethod = ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'OTHER'][faker.datatype.number({ min: 0, max: 3 })];
        const paidAt = faker.date.recent().toISOString().slice(0, 19).replace('T', ' ');

        if (generateCSV) {
            // 生成CSV格式的数据
            paymentStream.write(`${i},${paymentMethod},${totalAmount.toFixed(2)},${paidAt}\n`);
        } else {
            // 生成SQL插入语句
            paymentStream.write(`INSERT INTO payment_info (order_id, payment_method, paid_amount, paid_at) VALUES (${i}, '${paymentMethod}', ${totalAmount.toFixed(2)}, '${paidAt}');\n`);
        }
    }

    // 完成写入后关闭流
    ordersStream.end();
    detailsStream.end();
    paymentStream.end();
};

const numOrders = 5000000; // 示例生成50,000个订单
generateData(numOrders);

// 监听所有文件写入完成
Promise.all([
    new Promise(resolve => ordersStream.on('finish', resolve)),
    new Promise(resolve => detailsStream.on('finish', resolve)),
    new Promise(resolve => paymentStream.on('finish', resolve))
]).then(() => {
    const endTime = new Date();
    const timeDiff = (endTime - startTime) / 1000; // Calculate execution time in seconds
    console.log(`Data successfully saved in '${outputDir}'. Execution time: ${timeDiff} seconds`);
});



// const faker = require('faker');
// const fs = require('fs');
// const path = require('path');

// const startTime = new Date();
// const outputDir = path.join(__dirname, 'output');

// // 检查output目录是否存在，如果不存在则创建
// if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
// }

// // 创建数据流到output目录下的文件
// const ordersStream = fs.createWriteStream(path.join(outputDir, 'orders.sql'));
// const detailsStream = fs.createWriteStream(path.join(outputDir, 'order_details.sql'));
// const paymentStream = fs.createWriteStream(path.join(outputDir, 'payment_info.sql'));

// const numUsers = 400000; // 假定有40万用户
// const numProducts = 100000; // 假定有10万商品

// const generateData = (numOrders) => {
//     for (let i = 1; i <= numOrders; i++) {
//         const userId = faker.datatype.number({ min: 1, max: numUsers });
//         const createdAt = faker.date.past(1).toISOString().slice(0, 19).replace('T', ' ');
//         let totalAmount = 0;

//         const numItems = faker.datatype.number({ min: 1, max: 6 });
        
//         for (let j = 0; j < numItems; j++) {
//             const productId = faker.datatype.number({ min: 1, max: numProducts });
//             const quantity = faker.datatype.number({ min: 1, max: 5 });
//             const price = parseFloat(faker.commerce.price());
//             totalAmount += quantity * price;
//             detailsStream.write(`INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (${i}, ${productId}, ${quantity}, ${price});\n`);
//         }

//         const orderStatus = ['CREATED', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'][faker.datatype.number({ min: 0, max: 4 })];
//         ordersStream.write(`INSERT INTO orders (order_id, user_id, total_price, status, created_at) VALUES (${i}, ${userId}, ${totalAmount.toFixed(2)}, '${orderStatus}', '${createdAt}');\n`);

//         const paymentMethod = ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'OTHER'][faker.datatype.number({ min: 0, max: 3 })];
//         const paidAt = faker.date.recent().toISOString().slice(0, 19).replace('T', ' ');
//         paymentStream.write(`INSERT INTO payment_info (order_id, payment_method, paid_amount, paid_at) VALUES (${i}, '${paymentMethod}', ${totalAmount.toFixed(2)}, '${paidAt}');\n`);
//     }

//     // 完成写入后关闭流
//     ordersStream.end();
//     detailsStream.end();
//     paymentStream.end();
// };

// const numOrders = 50000; // 示例生成10000个订单
// generateData(numOrders);

// // 监听所有文件写入完成
// Promise.all([
//     new Promise(resolve => ordersStream.on('finish', resolve)),
//     new Promise(resolve => detailsStream.on('finish', resolve)),
//     new Promise(resolve => paymentStream.on('finish', resolve))
// ]).then(() => {
//     const endTime = new Date();
//     const timeDiff = (endTime - startTime) / 1000; // Calculate execution time in seconds
//     console.log(`Data successfully saved in '${outputDir}'. Execution time: ${timeDiff} seconds`);
// });

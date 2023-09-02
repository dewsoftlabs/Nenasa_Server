require('dotenv').config();

const config = require('./config.js');
const mysql = require('mysql2/promise');

const tableInfo = [
  {
    tableName: 'user',
    fields: [
      { name: 'userid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'fullname', type: 'VARCHAR(255)' },
      { name: 'phonenumber', type: 'VARCHAR(10)' },
      { name: 'address', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'username', type: 'VARCHAR(255)' },
      { name: 'password', type: 'VARCHAR(255)' },
      { name: 'profileimage', type: 'VARCHAR(255)' },
      { name: 'userroleid', type: 'INT(5)' },
      { name: 'branchid', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'shop',
    fields: [
      { name: 'shopname', type: 'VARCHAR(255)' },
      { name: 'shopnphonenumber', type: 'VARCHAR(10)' },
      { name: 'address', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'website', type: 'VARCHAR(255)' },
      { name: 'facebook', type: 'VARCHAR(255)' },
      { name: 'instragram', type: 'VARCHAR(255)' },
      { name: 'whatsapp', type: 'VARCHAR(255)' },
      { name: 'logo', type: 'VARCHAR(255)' },
    ],
  },
  {
    tableName: 'supplier',
    fields: [
      { name: 'supplier_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'supplier_name', type: 'VARCHAR(255)' },
      { name: 'supplier_address', type: 'VARCHAR(255)' },
      { name: 'supplier_email', type: 'VARCHAR(255)' },
      { name: 'supplier_phone', type: 'VARCHAR(10)' },
      { name: 'supplier_adddate', type: 'DATETIME' },
      { name: 'supplier_status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'item',
    fields: [
      { name: 'itemid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'item_code', type: 'VARCHAR(255)' },
      { name: 'item_name', type: 'VARCHAR(255)' },
      { name: 'item_description', type: 'VARCHAR(255)' },
      { name: 'catid', type: 'INT(255)' },
      { name: 'subcatid', type: 'INT(255)' },
      { name: 'storageid', type: 'INT(255)' },
      { name: 'sale_warranty', type: 'VARCHAR(15)' },
      { name: 'condition_type', type: 'VARCHAR(15)' },
      { name: 'brandid', type: 'INT(255)' },
      { name: 'serial_status', type: 'INT(5)' },
      { name: 'item_image', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'category',
    fields: [
      { name: 'catid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'cat_name', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'subcategory',
    fields: [
      { name: 'subcatid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'subcat_name', type: 'VARCHAR(255)' },
      { name: 'catid', type: 'INT(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'branch',
    fields: [
      { name: 'branchid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'branch_name', type: 'VARCHAR(255)' },
      { name: 'branch_location', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'userrole',
    fields: [
      { name: 'userroleid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'role', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'colors',
    fields: [
      { name: 'colorid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'colorname', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'brands',
    fields: [
      { name: 'brandid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'brandname', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'permission',
    fields: [
      { name: 'permissionid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'permission_code', type: 'VARCHAR(255)' },
      { name: 'permission_description', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
    ],
  },

  {
    tableName: 'assign_permission',
    fields: [
      { name: 'assignpermissionid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'permission_code', type: 'VARCHAR(255)' },
      { name: 'userroleid', type: 'VARCHAR(255)' },
      { name: 'status', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'grn',
    fields: [
      { name: 'grnno', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'supplier_id', type: 'INT(255)' },
      { name: 'reference_number', type: 'VARCHAR(255)' },
      { name: 'branch_id', type: 'INT(255)' },
      { name: 'user_id', type: 'INT(255)' },
      { name: 'status', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'grn_temp',
    fields: [
      { name: 'grntempid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'itemid', type: 'INT(255)' },
      { name: 'sell_price', type: 'VARCHAR(255)' },
      { name: 'item_name', type: 'VARCHAR(255)' },
      { name: 'purchase_price', type: 'VARCHAR(255)' },
      { name: 'sell_price', type: 'VARCHAR(255)' },
      { name: 'wholesale_price', type: 'VARCHAR(255)' },
      { name: 'discount', type: 'VARCHAR(255)' },
      { name: 'grnqty', type: 'VARCHAR(255)' },
      { name: 'grnno', type: 'INT(255)' },
      { name: 'branch_id', type: 'INT(255)' },
      { name: 'status', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'item_price',
    fields: [
      { name: 'item_priceid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'itemid', type: 'INT(255)' },
      { name: 'sell_price', type: 'FLOAT(10, 2)' },
      { name: 'purchase_price', type: 'FLOAT(10, 2)' },
      { name: 'wholesale_price', type: 'FLOAT(10, 2)' },
      { name: 'discount', type: 'FLOAT(10, 2)' },
      { name: 'branch_id', type: 'INT(255)' },
      { name: 'status', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'stock',
    fields: [
      { name: 'stockid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'itemid', type: 'INT(255)' },
      { name: 'qty', type: 'INT(255)' },
      { name: 'branch_id', type: 'INT(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'customer',
    fields: [
      { name: 'customer_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'customer_name', type: 'VARCHAR(255)' },
      { name: 'customer_phone', type: 'VARCHAR(15)' },
      { name: 'customer_email', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'grnpayment',
    fields: [
      { name: 'grnpayment_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'grnno', type: 'INT(255)' },
      { name: 'total_amount', type: 'FLOAT' },
      { name: 'resiptNo', type: 'VARCHAR(255)' },
      { name: 'payment_status', type: 'INT(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'itemdetails',
    fields: [
      { name: 'itemdetails_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'grnno', type: 'INT(255)' },
      { name: 'sirial_no', type: 'VARCHAR(255)' },
      { name: 'emi_number', type: 'VARCHAR(255)' },
      { name: 'colorid', type: 'INT(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'temp_itemdetails',
    fields: [
      { name: 'temp_itemdetails_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'grntempid', type: 'INT(255)' },
      { name: 'serial_no', type: 'VARCHAR(255)' },
      { name: 'emi_number', type: 'VARCHAR(255)' },
      { name: 'colorid', type: 'INT(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'storage',
    fields: [
      { name: 'storageid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'storage_size', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
];


// Function to check and set up the tables
async function checkTables() {
  try {
    const pool = await mysql.createPool(config.connection);
    const connection = await pool.getConnection();

    const existingTables = await getExistingTables(connection);
    await createNewTables(connection, existingTables);
    // await removeUnusedTables(connection, existingTables);

    connection.release();
    pool.end();
  } catch (err) {
    console.error(err);
  }
}

// Function to get existing table names from the database
async function getExistingTables(connection) {
  const [rows] = await connection.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${config.connection.database}'`);
  return rows.map(row => row.TABLE_NAME);
}

// Function to create new tables and add indexes if needed
async function createNewTables(connection, existingTables) {
  for (const table of tableInfo) {
    if (!existingTables.includes(table.tableName)) {
      const fieldsString = table.fields.map((field) => `${field.name} ${field.type}`).join(', ');

      // Create the table with the defined fields
      const createQuery = `CREATE TABLE ${table.tableName} (${fieldsString})`;
      await connection.query(createQuery);
      console.log(`Table '${table.tableName}' created!`);

      // Add indexes after creating the table
      if (table.indexes) {
        for (const index of table.indexes) {
          const indexQuery = `ALTER TABLE ${table.tableName} ADD INDEX ${index.name} (${index.columns.join(', ')})`;
          await connection.query(indexQuery);
          console.log(`Index '${index.name}' added to table '${table.tableName}'`);
        }
      }
    } else {
      await checkAndAlterFields(connection, table);
    }
  }
}

// Function to check and alter fields in existing tables if needed
async function checkAndAlterFields(connection, table) {
  const [columns] = await connection.query(`SHOW COLUMNS FROM ${table.tableName}`);
  const existingFields = columns.map(column => column.Field);
  const fieldsToAdd = table.fields.filter(field => !existingFields.includes(field.name));
  const fieldsToRemove = existingFields.filter(field => !table.fields.some(f => f.name === field));

  if (fieldsToAdd.length > 0) {
    await addFieldsToTable(connection, table.tableName, fieldsToAdd);
  }

  if (fieldsToRemove.length > 0) {
    await removeFieldsFromTable(connection, table.tableName, fieldsToRemove);
  }
}

// Function to add new fields to an existing table
async function addFieldsToTable(connection, tableName, fieldsToAdd) {
  for (const field of fieldsToAdd) {
    const addQuery = `ALTER TABLE ${tableName} ADD COLUMN ${field.name} ${field.type}`;
    await connection.query(addQuery);
    console.log(`Field '${field.name}' added to table '${tableName}'`);
  }
}

// Function to remove fields from an existing table
async function removeFieldsFromTable(connection, tableName, fieldsToRemove) {
  for (const field of fieldsToRemove) {
    const removeQuery = `ALTER TABLE ${tableName} DROP COLUMN ${field}`;
    await connection.query(removeQuery);
    console.log(`Field '${field}' removed from table '${tableName}'`);
  }
}

// Uncomment and use this function to remove unused tables
/*
async function removeUnusedTables(connection, existingTables) {
  for (const existingTable of existingTables) {
    const tableExists = tableInfo.some(table => table.tableName === existingTable);
    if (!tableExists) {
      const removeQuery = `DROP TABLE ${existingTable}`;
      await connection.query(removeQuery);
      console.log(`Table '${existingTable}' removed`);
    }
  }
}
*/

// Export the necessary functions and tableInfo
module.exports = { checkTables, tableInfo };

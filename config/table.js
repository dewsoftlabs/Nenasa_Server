require('dotenv').config();

const config = require('./config.js');
const mysql = require('mysql2/promise');

const tableInfo = [
  {
    tableName: 'user',
    fields: [
      { name: 'userid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'fullname', type: 'VARCHAR(255)' },
      { name: 'phonenumber', type: 'VARCHAR(15)' },
      { name: 'address', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'gender', type: 'VARCHAR(10)' },
      { name: 'nic', type: 'VARCHAR(255)' },
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
      { name: 'shopnphonenumber', type: 'VARCHAR(15)' },
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
    tableName: 'category',
    fields: [
      { name: 'catid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'cat_name', type: 'VARCHAR(255)' },
      { name: 'deposit', type: 'INT(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'route',
    fields: [
      { name: 'routeid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'route_name', type: 'VARCHAR(255)' },
      { name: 'userid', type: 'INT(255)' },
      { name: 'trndate', type: 'DATETIME' },
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
      { name: 'branch_status', type: 'INT(5)' },
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
    tableName: 'customer',
    fields: [
      { name: 'customer_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'customer_name', type: 'VARCHAR(255)' },
      { name: 'customer_phone', type: 'VARCHAR(15)' },
      { name: 'customer_email', type: 'VARCHAR(255)' },
      { name: 'customer_address', type: 'VARCHAR(255)' },
      { name: 'customer_gender', type: 'VARCHAR(10)' },
      { name: 'customer_nic', type: 'VARCHAR(255)' },
      { name: 'branchid', type: 'INT(5)' },
      { name: 'routeid', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'customer_status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'guarantor',
    fields: [
      { name: 'guarantor_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'guarantor_name', type: 'VARCHAR(255)' },
      { name: 'guarantor_phone', type: 'VARCHAR(15)' },
      { name: 'guarantor_email', type: 'VARCHAR(255)' },
      { name: 'guarantor_address', type: 'VARCHAR(255)' },
      { name: 'guarantor_nic', type: 'VARCHAR(255)' },
      { name: 'branchid', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'guarantor_status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'target',
    fields: [
      { name: 'target_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'target_amount', type: 'FLOAT' },
      { name: 'target_period', type: 'VARCHAR(15)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'loan_type',
    fields: [
      { name: 'loantype_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'loantype_name', type: 'VARCHAR(15)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'terms',
    fields: [
      { name: 'terms_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'no_of_terms', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'deposit_type',
    fields: [
      { name: 'depositType_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'depositType_name', type: 'VARCHAR(255)' },
      { name: 'depositType_rate', type: 'FLOAT' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'deposit_acc',
    fields: [
      { name: 'deposit_acc_no', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'customer_id', type: 'INT(255)' },
      { name: 'depositType_id', type: 'INT(255)' },
      { name: 'deposit_status', type: 'INT(5)' },
      { name: 'hold_startDate', type: 'VARCHAR(255)' },
      { name: 'hold_period', type: 'VARCHAR(255)' },
      { name: 'branchid', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' }
    ],
  },

  
  {
    tableName: 'loan',
    fields: [
      { name: 'loan_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'customer_id', type: 'INT(255)' },
      { name: 'deposit_acc_no', type: 'INT(255)' },
      { name: 'guarantor_id', type: 'INT(255)' },
      { name: 'business_name', type: 'VARCHAR(255)' },
      { name: 'business_type', type: 'VARCHAR(255)' },
      { name: 'userid', type: 'INT(255)' },
      { name: 'loan_amount', type: 'FLOAT' },
      { name: 'rate', type: 'FLOAT' },
      { name: 'loan_category', type: 'INT(5)' },
      { name: 'loantype_id', type: 'INT(255)' },
      { name: 'terms_id', type: 'INT(255)' },
      { name: 'installments', type: 'FLOAT' },
      { name: 'total_payable', type: 'FLOAT' },
      { name: 'startDate', type: 'VARCHAR(255)' },
      { name: 'endDate', type: 'VARCHAR(255)' },
      { name: 'document_charge', type: 'FLOAT' },
      { name: 'service_charge', type: 'FLOAT' },
      { name: 'hold_period', type: 'VARCHAR(255)' },
      { name: 'deposit_amount', type: 'FLOAT' },
      { name: 'status', type: 'INT(20)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' }
    ],
  },

  // {
  //   tableName: 'employee',
  //   fields: [
  //     { name: 'employee_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
  //     { name: 'employee_name', type: 'VARCHAR(255)' },
  //     { name: 'employee_address', type: 'VARCHAR(255)' },
  //     { name: 'employee_phone', type: 'VARCHAR(15)' },
  //     { name: 'employee_email', type: 'VARCHAR(255)' },
  //     { name: 'employee_gender', type: 'VARCHAR(255)' },
  //     { name: 'employee_nic', type: 'VARCHAR(20)' },
  //     { name: 'status', type: 'INT(5)' },
  //     { name: 'role', type: 'INT(5)' },
  //     { name: 'trndate', type: 'DATETIME' },
  //     { name: 'is_delete', type: 'INT(5)' },
  //   ],
  // },
  
];


// Function to check and set up the tables
async function checkTables() {
  try {
    const pool = await mysql.createPool(config.connection);
    const connection = await pool.getConnection();

    const existingTables = await getExistingTables(connection);
    await createNewTables(connection, existingTables);
    await removeUnusedTables(connection, existingTables);

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


// Export the necessary functions and tableInfo
module.exports = { checkTables, tableInfo };

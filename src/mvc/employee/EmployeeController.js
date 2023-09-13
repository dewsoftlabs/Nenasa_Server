const EmployeeModel = require("./EmployeeModel");
const EmployeeView = require('./EmployeeView');
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const login = (req, res) => {
    const { username, password } = req.body;

    UserModel.getUserByUsernameAndPassword(username, password, (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const user = results[0];

            if (user.status === 1) {
                const token = generateToken(user.email, user.userroleid, user.branchid);

                if (token) {
                    userView.renderUser(res, user, token);
                    return;
                }

                res.status(401).send({ error: 'Server error' });
                return;
            }

            res.status(401).send({ error: 'Account is not active' });
            return;
        }

        res.status(401).send({ error: 'Invalid username or password' });
    });
};



const addEmployee = (req, res) => {
  const employee = req.body; // Retrieve the employee data from the request body

  // Email validation regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email is valid
  if (!emailRegex.test(employee.email)) {
    res.status(400).send({ error: "Invalid email format" });
    return;
  }

  EmployeeModel.getEmployeeByEmail(employee.email, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (results.length > 0) {
      res.status(409).send({ error: "Email already exists" });
      return;
    }

    EmployeeModel.getEmployeeByPhonenumber(employee.phonenumber, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (results.length > 0) {
        res.status(409).send({ error: "Phone number already exists" });
        return;
      }

      EmployeeModel.getEmployeeByPhonenumber(employee.phonenumber, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }

        if (results.length > 0) {
          res.status(409).send({ error: "Phone number already exists" });
          return;
        }

        EmployeeModel.getEmployeeByEmpname(employee.name, (error, results) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error fetching data from the database" });
            return;
          }

          if (results.length > 0) {
            res.status(409).send({ error: "Username is already exists" });
            return;
          }

          EmployeeModel.addEmployee(employee, (error, EmployeeId) => {
            if (error) {
              res
                .status(500)
                .send({ error: "Error fetching data from the database" });
              return;
            }

            if (!EmployeeId) {
              res.status(500).send({ error: "Failed to create user" });
              return;
            }

            res
              .status(200)
              .send({ message: "User created successfully", EmployeeId });
          });
        });
      });
    });
  });
};

module.exports = {
    addEmployee
};

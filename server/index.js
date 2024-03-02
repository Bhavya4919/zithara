const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");


app.use(cors())
app.use(express.json());

//Routes//
app.post("/customers", async (req, res) => {
    try {
        const { customer_name, age, phone, location } = req.body;
        const newCustomer = await pool.query(
            "INSERT INTO customer_schema.customer_records (customer_name, age, phone, location) VALUES ($1, $2, $3, $4) RETURNING *",
            [customer_name, age, phone, location]
        );
        res.status(201).json(newCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

//get all records
app.get("/customers", async (req, res) => {
    try {
        let { sortBy, sortOrder, query: searchQuery } = req.query;
        sortBy = sortBy || 'date';
        sortOrder = sortOrder || 'ascending';
        let sortColumn = '';
        switch (sortBy) {
            case 'date':
                sortColumn = 'created_at::date';
                break;
            case 'time':
                sortColumn = 'created_at::time';
                break;
            default:
                sortColumn = 'created_at::date';
        }

        let queryCondition = '';
        let queryParams = [];

        if (searchQuery) {
            queryCondition = `
                WHERE LOWER(customer_name) LIKE LOWER($1)
                OR LOWER(location) LIKE LOWER($1)
            `;
            queryParams.push(`%${searchQuery}%`);
        }

        const selectQuery = `
            SELECT *, created_at::date AS date, created_at::time AS time
            FROM customer_schema.customer_records
            ${queryCondition}
            ORDER BY ${sortColumn} ${sortOrder === 'ascending' ? 'ASC' : 'DESC'}
        `;

        const result = await pool.query(selectQuery, queryParams);
        res.json({ data: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});



// app.get("/customers/search", async (req, res) => {
//     try {
//         const { query } = req.query;

//         let searchQuery = `
//             SELECT *, created_at::date AS date, created_at::time AS time
//             FROM customer_schema.customer_records
//             WHERE LOWER(customer_name) LIKE LOWER($1)
//             OR LOWER(location) LIKE LOWER($1)
//         `;

//         const result = await pool.query(searchQuery, [`%${query}%`]);

//         res.json({ data: result.rows });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: "Server Error" });
//     }
// });


//update records
app.put("/customers/:sno", async (req, res) => {
    try {
        const { sno } = req.params;
        const { customer_name, age, phone, location } = req.body;
        const updatedCustomer = await pool.query(
            "UPDATE customer_schema.customer_records SET customer_name = $1, age = $2, phone = $3, location = $4 WHERE sno = $5 RETURNING *",
            [customer_name, age, phone, location, sno]
        );
        res.json(updatedCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

//delete records
app.delete("/customers/:sno", async (req, res) => {
    try {
        const { sno } = req.params;
        await pool.query("DELETE FROM customer_schema.customer_records WHERE sno = $1", [sno]);
        res.json({ message: "Customer deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});


app.listen(5000, () => {
    console.log("server has sarted on port 5000");
})
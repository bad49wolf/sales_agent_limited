// getSales.js
const db = require("../../db")

const get_sales = async (req, res) => {
    try {
        const salesSnapshot = await db.collection('sales').get()
        const sales = []

        salesSnapshot.forEach(doc => {
            sales.push({
                id: doc.id,
                ...doc.data()
            })
        })

        res.json({
            ok: true,
            sales
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            error: 'there was an error fetching sales'
        })
    }
}

module.exports = get_sales
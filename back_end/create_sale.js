const db = require("../../db")


const create_sale = async (req, res) => {
    try {
        await db.collection('sales').add(req.body)
        res.json({
            ok: true
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: 'there was an error'
        })
    }
}

module.exports = create_sale
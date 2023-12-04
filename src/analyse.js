const fetchAllRows = async (db) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT raw_data.*, categories.name AS category_name, categories.color AS category_color
            FROM raw_data
            LEFT JOIN categories ON raw_data.category_id = categories.id`, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });

}

const guessCategories = async (db) => {
    const rows = await fetchAllRows(db);
    let sum = 0.0;
    rows.forEach((row) => {
        console.log('-------------------')
        if(['rewe', 'edeka', 'lidl', 'aldi', 'kaufland', 'penny', 'netto', 'real', 'marktkauf', 'famila', 'nahkauf', 'kaisers', 'kaufland', 'aldi', 'aldi nord', 'aldi süd', 'aldi süd', 'aldi nord'].some((word) => {return row.reason.toLowerCase().includes(word)})){
            //console.log(row.reason + ' ' + row.amount)
            sum += parseFloat(row.amount.replace(',','.')) * -1;
        }
    })
    console.log(`Rewe sum: ${sum}`);
}

export default guessCategories
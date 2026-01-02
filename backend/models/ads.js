const pool = require('./db');

async function createAd({ title, description, category = null, location = null, image_url = null, price = null, owner_id }) {
  const { rows } = await pool.query(
    `INSERT INTO ads (title, description, category, location, image_url, price, owner_id, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'active')
     RETURNING id, title, description, category, location, image_url, price, owner_id, status, created_at`,
    [title, description, category, location, image_url, price, owner_id]
  );
  return rows[0];
}

console.log("HIT getallads");

async function getAllAds() {
  const { rows } = await pool.query(
    `SELECT id, title, description, category, location, image_url, price, owner_id, status, created_at
     FROM ads
     WHERE status = 'active'
     ORDER BY created_at DESC`
  );
  return rows;
}

async function getAdById(id) {
  const { rows } = await pool.query(
    `SELECT id, title, description, category, location, image_url, price, owner_id, status, created_at
     FROM ads WHERE id = $1 AND status = 'active'`,
    [id]
  );
  return rows[0] || null;
}

async function updateAd({ id, title, description, category, location, image_url, price, owner_id }) {
  const { rows } = await pool.query(
    `UPDATE ads
       SET title=$1, description=$2, category=$3, location=$4, image_url=$5, price=$6
     WHERE id=$7 AND owner_id=$8
     RETURNING id, title, description, category, location, image_url, price, owner_id, status, created_at`,
    [title, description, category, location, image_url, price, id, owner_id]
  );
  return rows[0] || null;
}

async function deleteAd({ id, owner_id }) {
  const { rows } = await pool.query(
    `DELETE FROM ads WHERE id=$1 AND owner_id=$2 RETURNING id`,
    [id, owner_id]
  );
  return rows[0] || null;
}

async function getCategories() {
  const { rows } = await pool.query(
    `SELECT DISTINCT category FROM ads WHERE category IS NOT NULL`
  );
  return rows.map(r => r.category);
}

async function updateAdStatus({id, owner_id, status}) {
    const { rows } = await pool.query(
        `UPDATE ads
         SET status= $1
         WHERE id= $2 AND owner_id= $3
         RETURNING id, status`,
        [status, id, owner_id]
    );
    return rows[0] || null;
}

module.exports = {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  updateAdStatus,
  deleteAd,
  getCategories,
};

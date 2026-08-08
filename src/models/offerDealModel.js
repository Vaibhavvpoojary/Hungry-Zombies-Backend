const pool = require("../config/db");

const createOfferDeal = async (
  restaurantId,
  title,
  description,
  type,
  discountType,
  discountValue,
  imageUrl,
  startDate,
  endDate
) => {
  const result = await pool.query(
    `
    INSERT INTO offer_deals (
      restaurant_id,
      title,
      description,
      type,
      discount_type,
      discount_value,
      image_url,
      start_date,
      end_date
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      restaurantId,
      title,
      description,
      type,
      discountType,
      discountValue,
      imageUrl,
      startDate,
      endDate,
    ]
  );

  return result.rows[0];
};


const getOfferDealsByRestaurant = async (restaurantId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM offer_deals
    WHERE restaurant_id = $1
    ORDER BY created_at DESC
    `,
    [restaurantId]
  );

  return result.rows;
};


const getActiveOfferDealsByRestaurant = async (restaurantId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM offer_deals
    WHERE restaurant_id = $1
      AND is_active = TRUE
      AND (
        start_date IS NULL
        OR start_date <= CURRENT_TIMESTAMP
      )
      AND (
        end_date IS NULL
        OR end_date >= CURRENT_TIMESTAMP
      )
    ORDER BY created_at DESC
    `,
    [restaurantId]
  );

  return result.rows;
};


const getAllActiveOfferDeals = async () => {
  const result = await pool.query(
    `
    SELECT 
      offer_deals.*,
      restaurants.name AS restaurant_name
    FROM offer_deals
    JOIN restaurants
      ON offer_deals.restaurant_id = restaurants.id
    WHERE offer_deals.is_active = TRUE
      AND restaurants.is_active = TRUE
      AND (
        offer_deals.start_date IS NULL
        OR offer_deals.start_date <= CURRENT_TIMESTAMP
      )
      AND (
        offer_deals.end_date IS NULL
        OR offer_deals.end_date >= CURRENT_TIMESTAMP
      )
    ORDER BY offer_deals.created_at DESC
    `
  );

  return result.rows;
};


const findOfferDealById = async (offerDealId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM offer_deals
    WHERE id = $1
    `,
    [offerDealId]
  );

  return result.rows[0];
};


const updateOfferDeal = async (
  offerDealId,
  title,
  description,
  type,
  discountType,
  discountValue,
  imageUrl,
  startDate,
  endDate
) => {
  const result = await pool.query(
    `
    UPDATE offer_deals
    SET
      title = $1,
      description = $2,
      type = $3,
      discount_type = $4,
      discount_value = $5,
      image_url = $6,
      start_date = $7,
      end_date = $8
    WHERE id = $9
    RETURNING *
    `,
    [
      title,
      description,
      type,
      discountType,
      discountValue,
      imageUrl,
      startDate,
      endDate,
      offerDealId,
    ]
  );

  return result.rows[0];
};


const deactivateOfferDeal = async (offerDealId) => {
  const result = await pool.query(
    `
    UPDATE offer_deals
    SET is_active = FALSE
    WHERE id = $1
    RETURNING *
    `,
    [offerDealId]
  );

  return result.rows[0];
};


const deleteOfferDeal = async (offerDealId) => {
  const result = await pool.query(
    `
    DELETE FROM offer_deals
    WHERE id = $1
    RETURNING id
    `,
    [offerDealId]
  );

  return result.rows[0];
};


module.exports = {
  createOfferDeal,
  getOfferDealsByRestaurant,
  getActiveOfferDealsByRestaurant,
  findOfferDealById,
  updateOfferDeal,
  deactivateOfferDeal,
  deleteOfferDeal,
};
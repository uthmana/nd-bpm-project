// Validation function for the customer schema
export async function validateCustomerSchema(data) {
  const requiredFields = [
    'rep_name',
    'country_code',
    'province_code',
    'district_code',
  ]; // Add other required fields
  //const schemaFields = []; // Define all expected fields

  const missingFields = requiredFields.filter(
    (field) => !data.hasOwnProperty(field),
  );
  const errors = [];
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return errors;
}

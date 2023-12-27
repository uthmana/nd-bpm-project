// Validation function for the customer schema
export async function validateCustomerSchema(data) {
  const requiredFields = ['name', 'password']; // Add other required fields
  const schemaFields = ['name', 'email', 'password', 'PostalCode']; // Define all expected fields

  const missingFields = requiredFields.filter(
    (field) => !data.hasOwnProperty(field),
  );
  /*
  const extraFields = Object.keys(data).filter(
    (field) => !schemaFields.includes(field),
  );
*/
  const errors = [];
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }
  /*
  if (extraFields.length > 0) {
    errors.push(`Unexpected fields: ${extraFields.join(', ')}`);
  }
*/
  return errors;
}

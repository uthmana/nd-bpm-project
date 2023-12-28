// Validation function for the customer schema
export async function validateCustomerSchema(data) {
  const requiredFields = ['first_name', 'last_name']; // Add other required fields
  const schemaFields = [
    'first_name',
    'last_name',
    'email',
    'address',
    'postalCode',
    'company_name',
    'phoneNumber',
    'phoneNumber2',
    'code',
    'definition',
    'taxNo',
    'tax_Office',
  ]; // Define all expected fields

  const missingFields = requiredFields.filter(
    (field) => !data.hasOwnProperty(field),
  );
  const errors = [];
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return errors;
}

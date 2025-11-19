/**
 * Sets a localized field value on an object.
 * If the field and locale exist, updates the value; otherwise, initializes the field with the locale and value.
 *
 * @param obj - The target object to modify.
 * @param fieldName - The name of the field to set.
 * @param locale - The locale key (e.g., 'en-GB').
 * @param value - The value to set for the specified locale.
 */
export function setField(
  obj: Record<string, Record<string, any> | undefined>,
  fieldName: string,
  locale: string,
  value: any
): void;

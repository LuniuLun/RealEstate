const FAKE_TABLE_DATA: { [key: string]: string }[] = Array.from({ length: 5 }, (_, rowIndex) => ({
  Column1: `Row ${rowIndex + 1} - Col 1`,
  Column2: `Row ${rowIndex + 1} - Col 2`,
  Column3: `Row ${rowIndex + 1} - Col 3`,
  Column4: `Row ${rowIndex + 1} - Col 4`,
  Column5: `Row ${rowIndex + 1} - Col 5`
}))

export default FAKE_TABLE_DATA

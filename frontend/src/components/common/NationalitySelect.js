import React, { useState } from 'react';
import { 
  TextField, 
  MenuItem, 
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';

const nationalities = [
  'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 
  'Argentine', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian',
  'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean',
  'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British',
  'Bruneian', 'Bulgarian', 'Burkinabe', 'Burundian', 'Cambodian', 'Cameroonian',
  'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese',
  'Colombian', 'Comoran', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban',
  'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dutch', 'Ecuadorian',
  'Egyptian', 'Emirati', 'English', 'Equatorial Guinean', 'Eritrean', 'Estonian',
  'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian',
  'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinean',
  'Guinea-Bissauan', 'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelandic',
  'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian',
  'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan',
  'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese',
  'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger',
  'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian',
  'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian',
  'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mozambican', 'Namibian',
  'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian', 'Nigerien',
  'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan',
  'Palestinian', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian',
  'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan',
  'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean',
  'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean',
  'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander', 'Somali',
  'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese',
  'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik',
  'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian/Tobagonian',
  'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan',
  'Uzbekistani', 'Vatican', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite',
  'Zambian', 'Zimbabwean'
].sort();

const NationalitySelect = ({ value, onChange, required = false, error = false, helperText = '' }) => {
  return (
    <Autocomplete
      options={nationalities}
      value={value}
      onChange={(event, newValue) => {
        onChange({ target: { value: newValue } });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Nationality"
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      )}
      ListboxProps={{
        style: {
          maxHeight: '200px'
        }
      }}
    />
  );
};

export default NationalitySelect; 
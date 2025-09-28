import Select, { components } from "react-select";
import countryList from "react-select-country-list";

const Option = (props) => (
  <components.Option {...props}>
    <img
      src={`https://flagcdn.com/20x15/${props.data.value.toLowerCase()}.png`}
      alt={props.data.label}
      className="inline mr-2"
    />
    {props.data.label}
  </components.Option>
);

const SingleValue = (props) => (
  <components.SingleValue {...props}>
    <img
      src={`https://flagcdn.com/20x15/${props.data.value.toLowerCase()}.png`}
      alt={props.data.label}
      className="inline mr-2"
    />
    {props.data.label}
  </components.SingleValue>
);

export default function CountrySelect({ onChange }) {
  const options = countryList().getData(); // [{ label: "Canada", value: "CA" }, ...]

  return (
    <Select
      options={options}
      onChange={onChange}
      components={{ Option, SingleValue }}
      placeholder="Select a country"
    />
  );
}
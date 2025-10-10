import { useMemo } from "react";
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
  // [{ label: "Canada", value: "CA" }, ...]
const options = useMemo(() => {
  const list = countryList().getData();
  const canada = list.find(c => c.value === "CA");
  const usa= list.find(c => c.value === "US");
  const others = list.filter(c => c.value !== "CA"&& c.value !== "US");
  return [canada,usa, ...others];
}, []);
  return (
    <Select
      options={options}
      onChange={(onChange)}
      components={{ Option, SingleValue }}
      placeholder="Select a country"
    />
  );
}
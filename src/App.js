import "./styles.css";
import mapperSchema from "./mapper.schema.json";
import nayka from "./nykaa.data.json";
import { useEffect, useState } from "react";

let dataType = ["string", "number", "double", "date"];
export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(mapJson(mapperSchema, nayka));
  }, []);

  const mapJson = (mapper, data) => {
    let tempData = {};
    Object.keys(mapper).forEach((item) => {
      if (dataType.includes(mapper[item].type)) {
        if (dataType.includes(mapper[item].valueType)) {
          tempData = {
            ...tempData,
            [mapper[item].key]: data[item]
          };
        }
      } else if (mapper[item].type === "object") {
        // map primitive data type to object
        if (dataType.includes(mapper[item].valueType))
          tempData = {
            ...tempData,
            [mapper[item].key]: {
              ...tempData[mapper[item].key],
              [mapper[item].subObject.key]: data[item]
            }
          };
      } else if (mapper[item].type === "array") {
        // map array to array
        if (mapper[item].valueType === "array") {
          tempData = {
            ...tempData,
            [mapper[item].key]: data[item].map((subItems) => {
              return mapJson(mapper[item].subArray, subItems);
            })
          };
        } else if (dataType.includes(mapper[item].valueType)) {
          tempData = {
            ...tempData,
            [mapper[item].key]: [
              ...(tempData[mapper[item].key] ? tempData[mapper[item].key] : []),
              {
                [mapper[item].subObject.key]: data[item]
              }
            ]
          };
        }
      }
    });
    return tempData;
  };

  return (
    <>
      <pre>
        <code>
          // nykaa to invock
          <br />
        </code>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </>
  );
}

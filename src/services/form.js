import { get, set, chain, reduce, keys, map, invoke } from 'lodash';

function handleSubmit(e, form) {
  e && e.preventDefault();
  return new Promise((resolve, reject) => {
    form.validateFields((err, values) => (err ? reject(err) : resolve(values)));
  });
}

export const checkArrayKeys = (values, valueName, keyName) => {
  const el = get(values, valueName);
  set(
    values,
    valueName,
    chain(values)
      .get(keyName)
      .map((i, j) => {
        const item = el[i];
        item.numberInQueue = j;
        return item;
      })
      .value(),
  );
};

export const mapArrayValues = (array, name) =>
  reduce(
    array,
    (ans, el, i) => ({
      ...ans,
      ...keys(el).reduce(
        (ansN, key) => ({
          ...ansN,
          [`${name}[${i}].${key}`]: el[key],
        }),
        {},
      ),
    }),
    {},
  );

export const smartSetFields = (form, obj) => {
  keys(obj).forEach(key => form.getFieldValue(key));
  form.setFieldsValue(obj);
};

export const getFieldArrayDecorator = (form, array, name) =>
  form.getFieldDecorator(name, {
    initialValue: map(array, (el, i) => i),
  });

const getLengthFromValue = value => {
  if (value) {
    if (typeof value === 'number') return value.toString().length;
    else if (value.length) return value.length;
  }
  return 0;
};

export const setFocusInTheEnd = refInput => {
  invoke(refInput, 'focus');
  let namePath;
  if (get(refInput, 'input')) namePath = 'input';
  if (get(refInput, 'inputNumberRef.input')) namePath = 'inputNumberRef.input';
  invoke(
    refInput,
    `${namePath}.setSelectionRange`,
    getLengthFromValue(refInput.props.value),
    getLengthFromValue(refInput.props.value),
  );
};

export const getInitialValueForCheckBoxGroup = (
  namesArray = [],
  fromObject = {},
) =>
  namesArray.map(name => get(fromObject, name) && name).filter(value => value);

export default handleSubmit;

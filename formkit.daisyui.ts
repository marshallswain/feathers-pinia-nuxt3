const textClassification = {
  input: `
  $reset
   input 
   input-bordered
   w-full 
   focus-within:input-primary
   formkit-invalid:input-error
  `,
  label: 'font-bold text-base formkit-invalid:text-red-500 block mb-0.5',
}
const buttonClassification = {
  input: '$reset btn btn-primary',
}

export default {
  // the global key will apply to all inputs
  'global': {
    help: 'text-xs text-gray-500 m-1',
    message: '$reset text-error text-xs m-1',
    label: '$reset label-text ml-1',
    outer: '$reset my-2',
  },
  'button': buttonClassification,
  'date': textClassification,
  'datetime-local': textClassification,
  'checkbox': {
    input: '$reset checkbox checkbox-accent',
    inner: '$reset inline',
    label: '$reset ml-2 label-text',
    legend: '$reset font-bold px-1',
    fieldset: '$reset card card-bordered border-accent p-2',
    wrapper: '$reset cursor-pointer flex items-center justify-start max-w-fit',
  },
  'email': textClassification,
  'month': textClassification,
  'number': textClassification,
  'password': textClassification,
  'radio': {
    input: '$reset radio radio-accent',
    inner: '$reset inline',
    label: '$reset ml-2 label-text',
    legend: '$reset font-bold px-1',
    fieldset: '$reset card card-bordered border-accent p-2',
    wrapper: '$reset cursor-pointer flex items-center justify-start max-w-fit',
  },
  'range': {
    input: '$reset range range-secondary',
  },
  'search': textClassification,
  'select': textClassification,
  'submit': buttonClassification,
  'tel': textClassification,
  'text': textClassification,
  'textarea': {
    input: `
    $reset
    textarea
    input-bordered
    focus-within:input-info
    formkit-invalid:input-error
    `,
  },
  'time': textClassification,
  'url': textClassification,
  'week': textClassification,
}

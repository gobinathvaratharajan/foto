exports.assert = function (data, err, input) {
	if (!data) throw { message: err, ...input && { inputError: input }};
	return true;
};

exports.convertToMonthName = function (month) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[month - 1]
}

exports.base64 = {};

exports.base64.encode = function (data) {
    return Buffer.from(data).toString('base64');
}

exports.base64.decode = function (data) {
    return Buffer.from(data, 'base64').toString("utf-8");
}

exports.validate = function (form, fields) {
    // Input sanitization
    Object.keys(form).forEach((f) => {
        if (typeof form[f] === 'string' && (form[f].includes('<script>') || form[f].includes('</script>'))) {
            form[f] = form[f].replace(/<\/?script>/g, '');
        }
    });

    if (fields?.length) {
        fields.forEach((f) => {
            if (!form.hasOwnProperty(f) || !form[f]) {
                throw { message: `${f} field is required` };
            }
        });
    }
}

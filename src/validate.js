const validateName = (name) => {
    if (name === undefined || name === null) {
        return { isValid: false, message: "Missing name parameter" };
    }

    if (Array.isArray(name)) {
        return { isValid: false, message: "Name must be a string" };
    }

    if (typeof name !== "string") {
        return { isValid: false, message: "Name must be a string" };
    }

    const trimmed = name.trim();

    if (trimmed === "") {
        return { isValid: false, message: "Name cannot be empty" };
    }

    return { isValid: true, value: trimmed };
};

export default validateName;
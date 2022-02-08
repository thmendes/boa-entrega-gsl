export const knownErrors = {
    EMAIL_IS_REQUIRED: 'E-mail é obrigatório.',
    PASSWORD_IS_REQUIRED: 'Senha é obrigatória.',
    EMAIL_MALFORMED: 'E-mail inválido.',
    NOT_AUTHORIZED: 'E-mail ou Senha incorreta.',
    ALREADY_EXISTS: 'Usuário já existe.',
    INVALID_PASSWORD: 'Senha inválida. Por favor, informe uma senha que tenha: 8 ou mais caracteres; Ao menos 1 letra maiúscula; Ao menos 1 letra minúscula; Ao menos 1 caractere especial.',
    INTERNAL: 'Erro interno.',
    CODE_EXPIRED: 'Código expirado.',
    CONFIRMATION_MISSING_REQUIRED_PARAMETER: 'E-mail ou código não informado.'
};

const errorCodes = {
    'FieldsValidationError': 400,
    'NotAuthorizedException': 400,
    'Internal': 500,
    'InvalidPasswordException': 400,
    'UsernameExistsException': 400,
    'ExpiredCodeException': 400,
    'MissingRequiredParameter': 400
}

export const buildErrorResponse = (message, errors) => {
    return {
        message: message,
        errors: errors
    };
}

export const errorResponse = (name, message, errors) => {
    return {
        statusCode: errorCodes[name],
        body: buildErrorResponse(message, errors)
    };
}

package com.stockflow.shared.error;

import org.springframework.http.HttpStatus;

/** Base para erros de regra de negócio previstos; as próximas entregas estendem esta classe. */
public class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public BusinessException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }
}

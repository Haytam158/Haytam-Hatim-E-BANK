package com.ebank.authenticationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionVo {
    private int id;
    //this field contains the authority, for example : GET_ALL_CUSTUMERS
    private String authority;
}

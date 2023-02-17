package com.mohaeng.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
public class Home {
    @GetMapping("/")
    @ResponseBody
    public String home() {
        log.info("Home Controller");
        return "home";
    }
}

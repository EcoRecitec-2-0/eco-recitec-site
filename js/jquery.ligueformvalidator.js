function globalLigueFormConfig(e) {
    e = "undefined" == typeof e ? "" : e + " ";
    var t = [e + " input.not_null", e + " select:visible.not_null", e + " textarea:visible.not_null", e + " input:visible.not_zero", e + " input:visible.not_null_no_trim", e + " textarea:visible.not_null_no_trim"].join(", ");
    $(t).each(function() {
        $(this).parent().find("label").addClass("required")
    }), $(e + " input[type=text].datetime").each(function() {
        $(this).addClass("date").removeClass("datetime")
    }), $(e + " input:visible.date").each(function() {
        var e = (new Date).getFullYear(),
            t = e - 115 + ":" + e;
        $(this).hasClass("recent") ? t = e - 10 + ":" + e : $(this).hasClass("newest") && (t = e + ":" + (e + 10)), $(this).datepicker({
            changeMonth: !0,
            changeYear: !0,
            yearRange: t
        })
    }), $(e).on("submit", function() {
        return validator.formValidate(this) ? !0 : !1
    }), $(e + " input[type=text]," + e + " input[type=password]," + e + " select, " + e + " textarea").each(function() {
        $(this).keyup(function(e) {
            validator.fieldValidate(this)
        }), $(this).change(function(e) {
            validator.fieldValidate(this)
        })
    }), $(e + " .fone").addClass("number_mask"), $(e + " .fone").attr("mask", "(**) ****-*****").attr("placeholder", "(xx) xxxx-xxxxx"), $(e + " .cep").addClass("number_mask"), $(e + " .cep").attr("mask", "**.***-***").attr("placeholder", "xx.xxx-xxx"), $(e + " .cpf").addClass("number_mask"), $(e + " .cpf").attr("mask", "***.***.***-**").attr("placeholder", "xxx.xxx.xxx-xx"), $(e + " .cnpj").addClass("number_mask"), $(e + " .cnpj").attr("mask", "***.***.***/****-**").attr("placeholder", "xxx.xxx.xxx/xxxx-xx"), $(e + " .rg").addClass("number_mask"), $(e + " .rg").attr("mask", "************").attr("placeholder", "xxxxxxxxx"), $(e + " input[type=text].int").each(function() {
        $(this).addClass("integer").removeClass("int")
    }), $(e + " .integer").addClass("number_mask"), $(e + " .integer").attr("mask", "**********"), $(e + " .time").addClass("number_mask"), $(e + " .time").attr("mask", "**:**").attr("placeholder", "00:00"), $(e + " .date").addClass("number_mask"), $(e + " .date").attr("mask", "**/**/****").attr("placeholder", "xx/xx/xxxx"), $(e + " .alphanum_mask").attr("mask", "******************************"), $(e + " .alpha_mask").attr("mask", "******************************"), $(e + " .alpha_plus_mask").attr("mask", "******************************"), $(e + " .alphanum_plus_mask").attr("mask", "******************************"), "undefined" != typeof $("#_TEST_").maskMoney && ["percent", "decimal_1", "decimal_2", "decimal_3"].forEach(function(t, a) {
        var n = a ? a : 1,
            r = 1 == n ? "00.0" : 0..toFixed(a),
            o = 13;
        switch (t) {
            case "percent":
                o = 5;
                break;
            case "decimal_1":
                o++;
                break;
            case "decimal_2":
                o += 2;
                break;
            case "decimal_3":
                o += 3
        }
        $(e + " input[type=text]." + t).each(function(e) {
            $(this).attr("maxlength", o), $(this).maskMoney({
                symbol: "",
                decimal: ",",
                thousands: "",
                precision: n,
                allowZero: !$(this).hasClass("not_zero")
            }), $(this).attr("placeholder", r).bind("contextmenu", function() {
                return !1
            })
        })
    }), "undefined" != typeof $("#_TEST_").chosen && $(e + " .chosen-select").chosen({
        width: "100%",
        no_results_text: "Nenhum item encontrado!",
        search_contains: !0
    }), maskInput.init()
}
$(document).ready(function() {
    $("form.ligueformvalidator").each(function(e, t) {
        var a = $(t).attr("id") ? "#" + $(t).attr("id") + " " : 'form[name="' + $(t).attr("name") + '"]';
        globalLigueFormConfig(a)
    })
});
var validator = {
        vTypes: ["not_zero", "not_null", "not_null_no_trim", "percent", "decimal_2", "decimal_3", "email", "fone", "cep", "date", "time", "regex", "cnpj", "cpf", "min_value", "max_value"],
        warnings: {
            not_zero: "O campo {0} é obrigatório.",
            not_null: "O campo {0} é obrigatório.",
            not_null_no_trim: "O campo {0} é obrigatório.",
            email: "O valor do campo {0} é inválido.",
            percent: "O valor do campo {0} é inválido.",
            decimal_2: "O valor do campo {0} é inválido.",
            decimal_3: "O valor do campo {0} é invalido.",
            cpf: "O valor do campo {0} é invalido.",
            cnpj: "O valor do campo {0} é invalido.",
            fone: "O valor do campo {0} é inválido.",
            cep: "O valor do campo {0} é inválido.",
            regex: "O valor do campo {0} é inválido.",
            date: "O valor do campo {0} é inválido.",
            time: "O valor do campo {0} é inválido.",
            min_value: "O valor do campo {0} é inválido.",
            max_value: "O valor do campo {0} é inválido."
        },
        formValidate: function(e, t) {
            "undefined" == typeof t && (t = []);
            var a = $(e).attr("id") ? "#" + $(e).attr("id") + " " : 'form[name="' + $(e).attr("name") + '"]';
            return $(a + " input[type=text]:visible," + a + " input[type=password]:visible," + a + " input[type=checkbox]:visible," + a + " select:visible," + a + "textarea:visible").each(function() {
                var e = this,
                    a = !0;
                validator.changeStatus(e, !0), validator.vTypes.forEach(function(n) {
                    $(e).hasClass(n) && a && (a = validator.validType(e, n), a || (validator.changeStatus(e, a), t.push({
                        field: $(e),
                        msg: validator.warnings[n].replace("{0}", $(e).parent().children("label").html())
                    })))
                })
            }), t.length > 0 ? (validator.showErrorBox(a, t), !1) : !0
        },
        fieldValidate: function(e) {
            var t = !0,
                a = null;
            return validator.vTypes.forEach(function(n) {
                $(e).hasClass(n) && t && (t = validator.validType(e, n), a = validator.warnings[n].replace("{0}", $(e).parent().children("label").html()))
            }), validator.changeStatus(e, t, a), t
        },
        validType: function(el, type) {
            var isValid = !0;
            if ("regex" == type) return validator.test.regex($(el).val(), $(el).attr("expression"));
            var test = eval("validator.test." + type);
            return "function" == typeof test ? test($(el).val(), el) : void console.log("test is not a function")
        },
        test: {
            regex: function(v, exp) {
                if (v + "" == "") return !0;
                var expression = eval(exp);
                return expression instanceof RegExp ? expression.test(v) : (console.log("Is not RegExp."), !0)
            },
            percent: function(e) {
                return validator.test.regex(e, "/^\\d+\\,\\d{1}$/")
            },
            decimal_2: function(e) {
                return validator.test.regex(e, "/^\\d+\\,\\d{2}$/")
            },
            decimal_3: function(e) {
                return validator.test.regex(e, "/^\\d+\\,\\d{3}$/")
            },
            email: function(e) {
                return validator.test.regex(e, /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            },
            fone: function(e) {
                return validator.test.regex(e, "/^(\\([0-9][0-9]\\) [0-9]{4}-([0-9]{4}|[0-9]{5}))$/")
            },
            cep: function(e) {
                return validator.test.regex(e, "/^([0-9]{2}.[0-9]{3}-[0-9]{3})$/")
            },
            cnpj: function(e) {
                if (e + "" == "") return !0;
                e = e.replace(new RegExp("[./-]", "g"), "");
                var t, a, n, r, o, i, s, u, l = e;
                if (u = 1, l.length < 14) return !1;
                for (r = 0; r < l.length - 1; r++)
                    if (l.charAt(r) != l.charAt(r + 1)) {
                        u = 0;
                        break
                    }
                if (u) return !1;
                for (s = l.length - 2, t = l.substring(0, s), a = l.substring(s), n = 0, i = s - 7, r = s; r >= 1; r--) n += t.charAt(s - r) * i--, 2 > i && (i = 9);
                if (o = 2 > n % 11 ? 0 : 11 - n % 11, o != a.charAt(0)) return !1;
                for (s += 1, t = l.substring(0, s), n = 0, i = s - 7, r = s; r >= 1; r--) n += t.charAt(s - r) * i--, 2 > i && (i = 9);
                return o = 2 > n % 11 ? 0 : 11 - n % 11, o != a.charAt(1) ? !1 : !0
            },
            cpf: function(e) {
                if (e + "" == "") return !0;
                e = e.replace(new RegExp("[.-]", "g"), "");
                var t, a, n, r, o, i;
                if (i = 1, e.length < 11) return !1;
                for (r = 0; r < e.length - 1; r++)
                    if (e.charAt(r) != e.charAt(r + 1)) {
                        i = 0;
                        break
                    }
                if (i) return !1;
                for (t = e.substring(0, 9), a = e.substring(9), n = 0, r = 10; r > 1; r--) n += t.charAt(10 - r) * r;
                if (o = 2 > n % 11 ? 0 : 11 - n % 11, o != a.charAt(0)) return !1;
                for (t = e.substring(0, 10), n = 0, r = 11; r > 1; r--) n += t.charAt(11 - r) * r;
                return o = 2 > n % 11 ? 0 : 11 - n % 11, o != a.charAt(1) ? !1 : !0
            },
            date: function(e) {
                if ((e + "").length < 1) return !0;
                var t = /^((0?[1-9])|((1|2)[0-9])|(3(0|1)))[\/\-\.]((0?[1-9])|(1(0|1|2)))[\/\-\.](\d{4})$/;
                if (!t.test(e)) return !1;
                var a = e.split("/"),
                    n = 1 * a[2],
                    r = 1 * a[1] - 1,
                    o = 1 * a[0],
                    i = new Date(n, r, o),
                    s = new Date;
                return n > s.getUTCFullYear() + 10 ? !1 : n < s.getUTCFullYear() - 120 ? !1 : i.getMonth() != r ? !1 : i.getUTCFullYear() != n ? !1 : !0
            },
            time: function(e) {
                if ((e + "").length < 1) return !0;
                var t = /^(((0|1)[0-9])|2[0-3]):[0-5][0-9]$/;
                return t.test(e)
            },
            not_null: function(e, t) {
                return "undefined" == typeof e ? (console.log("Value is undefined."), !1) : "" != (e + "").trim()
            },
            not_zero: function(e, t) {
                return "undefined" == typeof e ? (console.log("Value is undefined."), !1) : (e = "" == (e + "").trim() ? 0 : (e + "").trim(), parseFloat(e))
            },
            not_null_no_trim: function(e) {
                return validator.test.not_null(e, !1)
            },
            min_value: function(e, t) {
                var a = $(t).attr("min-value");
                return "undefined" != typeof a && "" != a && "" != e ? 1 * e >= 1 * a : !0
            },
            max_value: function(e, t) {
                var a = $(t).attr("max-value");
                return "undefined" != typeof a && "" != a && "" != e ? 1 * a >= 1 * e : !0
            }
        },
        showErrorBox: function(e, t) {
            if ("form" != $(e).prop("tagName").toLowerCase() && (e = "#" + $(e).closest("form").attr("id")), t.length > 0)
                for (var a in t) {
                    var n = $(t[a].field).parent(".form-group").find("#errorContainer").first();
                    n && $(n).html(t[a].msg)
                }
        },
        changeStatus: function(e, t, a) {
            var n = $(e).parent(".form-group").find("#errorContainer").first();
            return t ? ($(e).removeClass("invalid"), n && $(n).html("")) : ($(e).addClass("invalid"), n && $(n).html(a)), t
        }
    },
    maskInput = {
        init: function() {
            $("input:visible.number_mask").not(".cnpj , .cpf").keydown(function(e) {
                return maskInput.keyCodeTest.number(e.keyCode)
            }), $("input:visible.number_mask").not(".cnpj , .cpf").keyup(function(e) {
                return maskInput.keyCodes(e.keyCode, [8, 9]) ? !1 : (maskInput.keyUpTest(this, /^\d+$/), maskInput.keyCodeTest.number(e.keyCode) ? void validator.fieldValidate(this) : !1)
            }), $("input:visible.number_mask").filter(".cnpj, .cpf").keydown(function(e) {
                return maskInput.keyCodeTest.number(e.keyCode)
            }), $("input:visible.number_mask").filter(".cnpj, .cpf").keyup(function(e) {
                return maskInput.keyCodes(e.keyCode, [8, 9]) ? !1 : (maskInput.keyUpTest(this, /^\d+$/, !0), maskInput.keyCodeTest.number(e.keyCode) ? void validator.fieldValidate(this) : !1)
            }), $("input:visible.alphanum_mask").keydown(function(e) {
                return maskInput.keyCodeTest.alphanum(e.keyCode)
            }), $("input:visible.alphanum_mask").keyup(function(e) {
                return maskInput.keyCodes(e.keyCode, [8, 9]) ? !1 : (maskInput.keyUpTest(this, /^[a-z0-9]+$/i), maskInput.keyCodeTest.alphanum(e.keyCode) ? void validator.fieldValidate(this) : !1)
            }), $("input:visible.alphanum_plus_mask").keydown(function(e) {
                return maskInput.keyCodeTest.alphanum_plus(e.keyCode)
            }), $("input:visible.alphanum_plus_mask").keyup(function(e) {
                return maskInput.keyCodes(e.keyCode, [8, 9]) ? !1 : (maskInput.keyUpTest(this, /^[a-z0-9\.\-_]+$/i), maskInput.keyCodeTest.alphanum_plus(e.keyCode) ? void validator.fieldValidate(this) : !1)
            }), $("input:visible.alpha_mask").keydown(function(e) {
                return maskInput.keyCodeTest.alpha(e.keyCode)
            }), $("input:visible.alpha_mask").keyup(function(e) {
                return maskInput.keyCodes(e.keyCode, [8, 9]) ? !1 : (maskInput.keyUpTest(this, /^[a-z]+$/i), maskInput.keyCodeTest.alpha(e.keyCode) ? void validator.fieldValidate(this) : !1)
            }), $("input:visible.alpha_plus_mask").keydown(function(e) {
                return maskInput.keyCodeTest.alpha_plus(e.keyCode)
            }), $("input:visible.alpha_plus_mask").keyup(function(e) {
                return maskInput.keyCodes(e.keyCode, [8, 9]) ? !1 : (maskInput.keyUpTest(this, /^[a-z\.\-_]+$/i), maskInput.keyCodeTest.alpha_plus(e.keyCode) ? void validator.fieldValidate(this) : !1)
            })
        },
        keyUpTest: function(e, t, a) {
            a = a || !1;
            var n = $(e).val(),
                r = (n.split("").pop(), "");
            n.split("").forEach(function(e) {
                t.test(e) && (r += e + "")
            });
            var o = $(e).attr("mask") ? $(e).attr("mask") : "(**) ****-*****",
                i = o.length;
            a ? (o = o.split("").reverse().join(""), r.split("").reverse().forEach(function(e) {
                o = o.replace("*", e)
            }), o = o.split("").reverse().join("")) : r.split("").forEach(function(e) {
                o = o.replace("*", e)
            }), o = o.replace(new RegExp("\\*", "g"), ""), $(e).val(o.substr(0, i))
        },
        keyCodeTest: {
            alpha_plus: function(e) {
                return maskInput.rangeTest(e, 65, 90) || maskInput.keyCodes(e, [8, 9, 190, 189, 109])
            },
            alpha: function(e) {
                return maskInput.rangeTest(e, 65, 90) || maskInput.keyCodes(e, [8, 9])
            },
            alphanum: function(e) {
                return maskInput.rangeTest(e, 96, 105) || maskInput.rangeTest(e, 48, 57) || maskInput.rangeTest(e, 65, 90) || maskInput.keyCodes(e, [8, 9])
            },
            alphanum_plus: function(e) {
                return maskInput.rangeTest(e, 96, 105) || maskInput.rangeTest(e, 48, 57) || maskInput.rangeTest(e, 65, 90) || maskInput.keyCodes(e, [8, 9, 190, 189, 109])
            },
            number: function(e) {
                return maskInput.rangeTest(e, 96, 105) || maskInput.rangeTest(e, 48, 57) || maskInput.keyCodes(e, [8, 9]) || maskInput.charByCode(e, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
            }
        },
        rangeTest: function(e, t, a) {
            return e >= t && a >= e
        },
        keyCodes: function(e, t) {
            return -1 != t.indexOf(e)
        },
        charByCode: function(e, t) {
            return -1 != t.indexOf(String.fromCharCode(e))
        }
    };
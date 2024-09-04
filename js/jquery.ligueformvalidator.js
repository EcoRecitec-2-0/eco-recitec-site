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
    }), $(e).on("submit", function(event) {
        event.preventDefault(); 
        if (validator.formValidate(this)) {
            // Clear the form fields
            $(this).find("input[type=text], input[type=password], select, textarea").val("");
            $(this).find("input[type=checkbox]").prop("checked", false);
            this.submit(); // Submit the form programmatically
        }
        return false;
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
        this.reset();
    })
});

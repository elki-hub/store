(function () {
  "use strict";

  $(function () {
    $.validator.addMethod("validEmail", function (value, element) {
      return this.optional(element) || /^[@.\w]+$/i.test(value);
    });

    $("form[name='login']").validate({
      rules: {
        email: {
          required: true,
          email: true,
          maxlength: 255,
          validEmail: true,
        },
        password: {
          required: true,
          maxlength: 50,
        },
      },

      messages: {
        email: "Please enter a valid email address",

        password: {
          required: "Please enter password",
        },
      },

      submitHandler: function (form) {
        form.submit();
      },
    });
  });

  $(function () {
    $.validator.addMethod("char", function (value, element) {
      return this.optional(element) || /^[@.\w]+$/i.test(value);
    });

    $("form[name='registration']").validate({
      rules: {
        nickname: {
          required: true,
          maxlength: 14,
          char: true,
        },
        email: {
          required: true,
          email: true,
          maxlength: 255,
          char: true,
        },
        password: {
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        conf_password: {
          required: true,
          equalTo: "#password",
          maxlength: 50,
        },
      },

      messages: {
        nickname: {
          required: "Please enter your nickname",
          maxLength: "Nickname is too long",
          char: "Only letters, numbers, and '.@_' are allowed",
        },
        email: "Please enter a valid email address",
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 5 characters long",
          maxlength: "Your password is too long",
        },
        conf_password: {
          required: "Please repeat the password",
          equalTo: "Please make sure your passwords match",
          maxlength: "Your password is too long",
        },
      },

      submitHandler: function (form) {
        form.submit();
      },
    });
  });

  $(function () {
    $.validator.addMethod("char", function (value, element) {
      return this.optional(element) || /^[@.\w]+$/i.test(value);
    });

    $("form[name='drinkForm']").validate({
      rules: {
        name: {
          required: true,
          maxlength: 500,
          char: true,
        },
        category: {
          char: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0.01,
        },
        country: {
          char: true,
        },
        size: {
          type: Number,
          required: true,
          min: 0.01,
        },
        image: {
          char: true,
        },
        degree: {
          type: Number,
          required: true,
          min: 0,
        },
        description: {
          maxlength: 10000,
        },
      },

      messages: {
        name: {
          char: "Enter valid product name",
          required: "Product name is required.",
          maxlength: "Drink name is too long.",
        },
        category: {
          char: "This category is not allowed",
        },
        price: {
          type: "Only numbers are allowed",
          required: "Drink price is required",
          min: "Product price cannot be below 0",
        },
        country: {
          char: "This category is not allowed",
        },
        size: {
          type: "Only numbers are allowed",
          required: "drink size is required",
          min: "Product size cannot be below 0",
        },
        image: {
          char: "Can not validate this image",
        },
        degree: {
          type: "Only numbers are allowed",
          required: "Drink degree is required",
          min: "Product degree cannot be below 0",
        },
        description: {
          maxlength: "Description is too long",
        },
      },

      submitHandler: function (form) {
        form.submit();
      },
    });
  });
})();

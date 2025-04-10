class customCapProductVariant extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('[bt-category-switcher]').forEach(element => {
      element.addEventListener('click', this.onClick.bind(this))
    });
    this.addToCart = this.querySelector('[data-add-to-cart]');
    this.addToCart.addEventListener('click', this.onSubmitHandler.bind(this));
    this.variantQuanityChange();
    this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
    this.optionShowHide();
    this.selectPrintStyle();
    this.dataPrintInputChange();
  };

  dataPrintInputChange () {
    const current = this;
    const inputs = document.querySelectorAll('input[data-print-variant-id]');
    inputs.forEach(function(input) {
      input.addEventListener('change', function() {
        current.priceCalculate();
      });
    });
  }

  optionShowHide() {
    this.colorOptions = this.querySelectorAll('[data-color-id]');
    this.sizeOptions = this.querySelectorAll('[data-color-value]');
    this.colorOptions.forEach(colorOption => {
      colorOption.addEventListener('click', this.handleColorClick.bind(this));
    });
  }

  handleColorClick(event) {
    const selectedColorId = event.currentTarget.getAttribute('data-color-id');
    event.currentTarget.classList.toggle("is__active");
    this.sizeOptions.forEach(sizeOption => {
      const sizeValue = sizeOption.getAttribute('data-color-value');
      if (sizeValue === selectedColorId) {
        sizeOption.classList.toggle('active');
      }
    });
    this.pritnStyleToggle(this.colorOptions);
    this.activeBuybutton();
  }

  pritnStyleToggle(colorOptions) {
    this.printStyle = this.querySelector('.custom-product__printstyle');
    this.titleText = this.querySelector('.custom-product__titletext');
    this.dataStyleImage = this.querySelectorAll('[data-style-image]');
    this.printMethods = this.querySelectorAll('.print-method__container');
    let isActiveFound = false;
    colorOptions.forEach(colorOption => {
      if (colorOption.classList.contains('is__active')) {
        isActiveFound = true;
      }
    });
    if (isActiveFound) {
      if(this.printStyle) this.printStyle.classList.remove('hidden');
      if(this.titleText) this.titleText.classList.remove('hidden');
    } else {
      if(this.printStyle) this.printStyle.classList.add('hidden');
      if(this.titleText) this.titleText.classList.add('hidden');
      this.dataStyleImage.forEach(item => {
        item.classList.remove('print-style__images-active');
      });
      this.printMethods.forEach(item => {
        item.classList.add('hidden');
      });
    }
  }
  
  variantQuanityChange() {
    // this.colorElements = this.querySelectorAll('[data-color-value]');
    // this.colorElements.forEach(colorElement => {
    //   const sizeElements = colorElement.querySelectorAll('[data-variatn-id]');
    //   sizeElements.forEach(sizeOption => {
    //     const inputField = sizeOption.querySelector('.chose-size__qtyvalue');
    //     if (inputField) {
    //       inputField.addEventListener('keyup', this.handleKeyup.bind(this, colorElement, this.colorElements));
    //     }
    //   });
    // });

    this.colorElements = $(this).find('[data-color-value]');

    this.colorElements.each((_, colorElement) => {
      const sizeElements = $(colorElement).find('[data-variatn-id]');
    
      sizeElements.each((_, sizeOption) => {
        const inputField = $(sizeOption).find('.chose-size__qtyvalue');
    
        if (inputField.length) {
          inputField.on('keyup', this.handleKeyup.bind(this, colorElement, this.colorElements));
        }
      });
    });

  }

  handleKeyup(colorElement, colorElements) {
    const sizeOptions = $(colorElement).find('[data-variatn-id]');
    let totalPrice = 0;
    let totalQty = 0;
    
    sizeOptions.each(function () {
      const inputField = $(this).find('.chose-size__qtyvalue');
      const variantQty = parseInt($(this).attr('data-variant-qty'), 10);
      let variantPrice = parseFloat($(this).attr('data-variant-price'));
      variantPrice = variantPrice / 100;
      let inputValue = parseInt(inputField.val(), 10);
    
      if (isNaN(inputValue) || inputValue < 0) {
        inputValue = 0;
      }
      // else if (inputValue > variantQty) {
      //   inputValue = variantQty;
      // }
    
      inputField.val(inputValue);
      totalQty += inputValue;
      totalPrice += inputValue * variantPrice;
    });
    
    const totalPriceInput = $(colorElement).find('[data-total-price]');
    if (totalPriceInput.length) {
      // totalPriceInput.val(totalPrice.toFixed(2));
      totalPriceInput.val(totalQty);
    }

    this.activeBuybutton();
    this.priceCalculate();
  }

  activeBuybutton() {
    this.colorElements = $(this).find('[data-color-value].active');
    let quantityExist = false;
    
    this.colorElements.each(function () {
      const sizeElements = $(this).find('[data-variatn-id]');
      
      sizeElements.each(function () {
        const inputField = $(this).find('.chose-size__qtyvalue');
        const inputValue = parseInt(inputField.val(), 10);
        
        if (inputValue > 0) {
          quantityExist = true;
        }
      });
    });
    
    if (quantityExist) {
      $(this.addToCart).removeAttr("disabled");
    } else {
      $(this.addToCart).attr("disabled", "");
    }
  }

  selectPrintStyle() {
      this.styleImages = $('[data-style-image]');
      if (this.styleImages.length) {
        this.styleImages.each(function () {
          $(this).on('click', function (event) {
            const dataStyleImage = $(event.target).closest('[data-style-image]');
            const currentElement = $(event.target).closest('[data-name]');
            dataStyleImage.toggleClass('print-style__images-active');
            let data_style_value = currentElement.attr('data-name');
            $('.print-method__container[data-match-name="'+data_style_value+'"] .print-method__item--supported.active_method').trigger('click');      
            const imgSrc = dataStyleImage.find('.image img').attr('src');
      
            dataStyleImage.siblings().removeClass('print-style__images-active');

            if ($('.print-style__images-active').length > 0) {
              $('.upload-art').removeClass('hidden');
            } else {
              $('.upload-art').addClass('hidden');
            }

            const dataName = currentElement.attr('data-name');
            const dataMatchName = $('[data-match-name="' + dataName + '"]');
            const uploadArtItem = $('.upload-art__item[data-art="' + dataName + '"]');
            if (dataStyleImage.hasClass('print-style__images-active')) {
              uploadArtItem.addClass('artimg-active');
            } else {
              uploadArtItem.removeClass('artimg-active');
            }
      
            dataMatchName.find('.print-method__image-media').attr('src', imgSrc);
      
            if (dataMatchName.length) {
              let activeExist = false;
              currentElement.find('[data-style-image]').each(function () {
                if ($(this).hasClass('print-style__images-active')) {
                  activeExist = true;
                }
              });
              if (activeExist) {
                dataMatchName.removeClass('hidden');
              } else {
                dataMatchName.addClass('hidden');
              }
            }
          });
        });
      }

    this.printStyleShowHide();
  }

  printStyleShowHide(){
    const printMethoditems = $('.print-method__item--supported[print-method-data-name]');
    const mainSection = this;
    printMethoditems.click(function() {
      var printDataname = $(this).attr('print-method-data-name');
      var method_locaton_name = $(this).closest('.print-method__container[data-match-name]').attr('data-match-name');
      var print_location_field = $('.print-style__item[data-name="'+method_locaton_name+'"] .print-style__images-active');
      let print_location_value = print_location_field.attr('data-style-image');
      if($(this).hasClass('active_method')) {
        $(this).removeClass('active_method');
        $(this).closest('.print-method__container').find('.print-size_container [data-print-type="'+printDataname+'"]').addClass('hidden');
      } else {
        $(this).addClass('active_method');
        $(this).siblings().removeClass('active_method');
        $(this).closest('.print-method__container').find('.print-size_container [data-print-type]').addClass('hidden');
       $(this).closest('.print-method__container').find('.print-size_container [data-print-type="'+printDataname+'"][data-print-type-showon="'+print_location_value+'"]').removeClass('hidden');
        $(this).closest('.print-method__container').find('.print-size_container [data-print-type="'+printDataname+'"][data-print-type-showon="'+print_location_value+'"] .print-variant__item:first-child .print-style_label').trigger('click');
      }
      mainSection.priceCalculate();
    })
  }

  priceCalculate(){
    let allVariantPrice = 0;
    const priceDataElement = document.getElementById('priceData');
    const priceData = JSON.parse(priceDataElement.textContent);

    $('.chose-size.active').each(function () {
      $(this).find('input').each(function () {
        const inputField = $(this);
        const inputValue = parseInt(inputField.val(), 10);

        if (!isNaN(inputValue) && inputValue > 0) {
          let variantPrice = parseFloat(
            inputField.closest('.chose-size__optons').attr('data-variant-price')
          );
          debugger

          if (!isNaN(variantPrice)) {
            variantPrice = variantPrice / 100;
            const totalQtyPrice = inputValue * variantPrice;
            allVariantPrice += totalQtyPrice;
          }
        }
      });
    });
    debugger

    $('.active_method[print-method-data-name]').each(function() {
      const active_method = $(this);
      const printMethodDataName = active_method.attr('print-method-data-name');
      const inputVariantId = active_method.closest('.print-method__container')
          .find('[data-print-type="'+ printMethodDataName +'"]');
      var checked_variant_id = parseInt(inputVariantId.find('input:checked').attr('data-print-variant-id'));
      const targetObject = priceData.find(item => item.id === checked_variant_id);
      let TotalColorQty = 0;

      $('.chose-size__qty input[data-total-price]').each(function() {
          const colorQty = parseInt($(this).val()) || 0;
          TotalColorQty += colorQty;
      });
      if (targetObject) {
        for (const [quantity, price] of Object.entries(targetObject.price)) {
          if (TotalColorQty <= quantity) {
            console.log(`Quantity: ${quantity}, Price: ${price}`);
            let current_price = TotalColorQty * price
            allVariantPrice += current_price;
            break;
          }
        }
      }else{
        console.log("targetObject not found");
      }
    });
    if(allVariantPrice >= 1){
      $('[btn_total_price]').text('$'+allVariantPrice.toFixed(2));
      $('[btn_total_price]').attr('price_colors',allVariantPrice.toFixed(2));
    } else {
      $('[btn_total_price]').empty();
      $('[btn_total_price]').removeAttr('price_colors',allVariantPrice);
    }
  }
  
  onSubmitHandler(evt) {
    evt.preventDefault();
    var price_colors = parseFloat($('[btn_total_price]').attr('price_colors'));
    if (price_colors == undefined) {
      return false;
    }
    const addToCart = this.addToCart;
    const cart_drawer = this.cart;
    addToCart.classList.add("loading");
    const loadingIcon = this.addToCart.querySelector(".loading__spinner");
    loadingIcon.classList.remove("hidden");
    let variantData = [];
    var printProperty="";
    const randomProp = Math.random().toString(36).substring(2,9);
    const productId = this.querySelector('.main_product_id').value;
    const prined_part = $('.print-style__images-active');
    prined_part.each((index, itemPart) => {
      let dataName = $(itemPart).closest('[data-name]').attr('data-name');
      let printMethod = $('[data-match-name="'+dataName+'"]');
      let activeMethod = $(printMethod).find('.active_method').attr("print-method-data-name");
      let printActiveproduct = $(printMethod).find('[data-print-type="'+activeMethod+'"]');
      dataName = $(printActiveproduct).find('input:checked').attr('data-input-print-location');
      console.log(dataName,"dataNameee");
      let printActiveproductValue = $(printActiveproduct).find('input:checked').val();
      let printActiveproductID = parseInt($(printActiveproduct).find('input:checked').attr('data-print-variant-id'));
      if(dataName != undefined){
        printProperty = printProperty + dataName+" / ";
      }
      if(activeMethod != undefined){
        printProperty = printProperty + activeMethod+" / ";
      }
      if(index == prined_part.length - 1) {
        if(printActiveproductValue != undefined){
          printProperty = printProperty + printActiveproductValue;
        }
      }else{
        if(printActiveproductValue != undefined){
          printProperty = printProperty + printActiveproductValue+" || ";
        }
      }
      const dataObject = {
        id: printActiveproductID,
        qty: 1,
        child_prop: 'childproduct'
      };
      variantData.push(dataObject);
    });
    this.colorElements = this.querySelectorAll('[data-color-value].active');
    var front_elem = $('.upload-art__item--front.artimg-active');
    if(front_elem.length > 0) {
      var inputElement = $(front_elem).find('input[type="file"]'); 
      if(inputElement.val() == "") {
        // alert("Upload Art Image..");
        // addToCart.classList.remove("loading");
        // loadingIcon.classList.add("hidden");
        // return
        front_elem = "";
      }else{
        front_elem = inputElement[0].files[0];
      }
    }else {
      front_elem = "";
    }
    var back_elem = $('.upload-art__item--back.artimg-active');
    if(back_elem.length > 0) {
      var inputElement = $(back_elem).find('input[type="file"]'); 
      if(inputElement.val() == "") {
        // alert("Upload Art Image..");
        // addToCart.classList.remove("loading");
        // loadingIcon.classList.add("hidden");
        // return
        back_elem = "";
      }else{
        back_elem = inputElement[0].files[0].name;
      }
    } else {
      back_elem = "";
    }
    var sleeve_elem = $('.upload-art__item--sleeve.artimg-active');
    if(sleeve_elem.length > 0) {
      var inputElement = $(sleeve_elem).find('input[type="file"]'); 
      if(inputElement.val() == "") {
        // alert("Upload Art Image..");
        // addToCart.classList.remove("loading");
        // loadingIcon.classList.add("hidden");
        // return
        sleeve_elem = "";
      }else {
        sleeve_elem = inputElement[0].files[0].name;
      }
    }else {
      sleeve_elem = "";
    }
    var neck_elem = $('.upload-art__item--neck.artimg-active');
    if(neck_elem.length > 0) {
      var inputElement = $(neck_elem).find('input[type="file"]'); 
      if(inputElement.val() == "") {
        // alert("Upload Art Image..");
        // addToCart.classList.remove("loading");
        // loadingIcon.classList.add("hidden");
        // return
        neck_elem = "";
      } else {
        neck_elem = inputElement[0].files[0].name;
      }
    }else {
      neck_elem = "";
    }
    this.colorElements.forEach(colorSection => {
      const colorName = colorSection.getAttribute('data-color-value');
      const sizeOptions = colorSection.querySelectorAll('[data-variatn-id]');
      sizeOptions.forEach(sizeOption => {
        const inputField = sizeOption.querySelector('.chose-size__qtyvalue');
        const variantId = sizeOption.getAttribute('data-variatn-id');
        const inputValue = parseInt(inputField.value, 10);
         // color: productId+"_"+colorName,
        if (inputValue > 0) {
          const dataObject = {
            id: variantId,
            qty: inputValue,
            prop: printProperty,
            price : price_colors,
            parent_prop:"parentproduct",
            font_print: front_elem,
            back_print: back_elem,
            neck_print: sleeve_elem,
            sleeve_print: neck_elem
          };
          variantData.push(dataObject);
        }
      });
    });

    async function submitFrom(productId, quantity, prop, child_prop, parent_prop, color_name, variant_price, isLast, font_print, back_print, neck_print, sleeve_print) {
      const formData = new FormData();
      formData.append('id', productId);
      formData.append('quantity', quantity);
      formData.append('properties[random]', "random__" + randomProp);
      if (prop != undefined) {
        formData.append('properties[Print]', prop);
      }
      if (color_name != undefined) {
        formData.append('properties[Color]', color_name);
      }
      if (parent_prop != undefined) {
        formData.append('properties[parent_prop]', parent_prop);
      }
      if (child_prop != undefined) {
        formData.append('properties[child_prop]', child_prop);
      }
      if (variant_price != undefined) {
        formData.append('properties[price]', variant_price);
      }
      if (font_print != "" && font_print != undefined) {
        formData.append('properties[font_print]', font_print);
      }
      if (back_print != "" && font_print != undefined) {
        formData.append('properties[back_print]', back_print);
      }
      if (neck_print != "" && font_print != undefined) {
        formData.append('properties[neck_print]', neck_print);
      }
      if (sleeve_print != "" && font_print != undefined) {
        formData.append('properties[sleeve_print]', sleeve_print);
      }
      if (cart_drawer) {
        formData.append(
          'sections',
          cart_drawer.getSectionsToRender().map((section) => section.id)
        );
        formData.append('sections_url', window.location.pathname);
        cart_drawer.setActiveElement(document.activeElement);
      }
      try {
        const response = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (!cart_drawer && isLast) {
          window.location = window.routes.cart_url;
          return;
        }
        if (cart_drawer) {
          cart_drawer.renderContents(data);
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
    
    async function addAllItemsToCart() {
      const totalItems = variantData.length;
      let currentIndex = 0;
    
      for (const item of variantData) {
        currentIndex++;
        const isLast = currentIndex === totalItems;
        const productId = item.id;
        const quantity = item.qty;
        const prop = item.prop;
        const child_prop = item.child_prop;
        const parent_prop = item.parent_prop;
        const color_name = item.color;
        const variant_price = item.price;
        const font_print = item.font_print;
        const back_print = item.back_print;
        const neck_print = item.neck_print;
        const sleeve_print = item.sleeve_print;
        await submitFrom(productId, quantity, prop, child_prop, parent_prop, color_name, variant_price, isLast, font_print, back_print, neck_print, sleeve_print);
      }

      addToCart.classList.remove("loading");
      loadingIcon.classList.add("hidden");
    }
    addAllItemsToCart();
  }
  onClick(event) {
    const currentValue = event.target.closest('button').getAttribute('data-filter-handle');
    this.fullPageSlider?.updateSlides(currentValue);
    document.querySelectorAll('[bt-category-switcher]').forEach(element => {
      const elementFilter = element.getAttribute('data-filter-handle');
      currentValue === elementFilter ? element.classList.add('active') : element.classList.remove('active')
    });

    this.categoryMenu.forEach(menuEl => {
      const menufilter = menuEl.getAttribute('data-menu');
      currentValue === menufilter ? menuEl.classList.add('active') : menuEl.classList.remove('active')
    })
  }
}
customElements.define('custom-cap-product-variant', customCapProductVariant);
(function() {
  // find the elements with the class 'edittime' and 'tippy-post-info' that have a 'data-hideip' attribute
  const elements = document.querySelectorAll('.edittime.tippy-post-info[data-hideip]');
  
  // get the user's UI language
  const uiLanguage = chrome.i18n.getUILanguage();

  // Create the DisplayNames instance once
  const countryNameFormatter = new Intl.DisplayNames([uiLanguage], { type: 'region' });

  elements.forEach(element => {
    // get the IP address from the 'data-hideip' attribute
    let ip = element.getAttribute('data-hideip');
    ip = ip.replace(/xxx$/, '123'); 

    // get the country code from the IP address using an external API
    fetch(`https://api.iplocation.net/?ip=${ip}`)
      .then(response => response.json())
      .then(data => {
        const countryCode = data.country_code2;
        if (countryCode && countryCode !== "") {
          const country = countryNameFormatter.of(countryCode);
          if (country) {
            element.insertAdjacentHTML(
              'afterend',
              `<span class="edittime location-info" style="margin-left: 0.5em;">${country}</span>`
            );
          } else {
            // get country name failed
            element.insertAdjacentHTML(
              'afterend',
              `<span class="edittime location-info" style="margin-left: 0.5em;">位置未知</span>`
            );
          }
        } else {
          // no country code found
          element.insertAdjacentHTML(
            'afterend',
            `<span class="edittime location-info" style="margin-left: 0.5em;">位置未知</span>`
          );
        }
      })
      .catch(error => {
        // handle errors, such as network issues or API errors
        console.error('Error fetching IP location:', error);
        element.insertAdjacentHTML(
          'afterend',
          `<span class="edittime location-info" style="margin-left: 0.5em;">位置未知</span>`
        );
      });
  });
})();
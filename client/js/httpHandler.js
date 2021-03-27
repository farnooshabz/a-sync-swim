(function() {

  const serverUrl = 'http://127.0.0.1:3000';


  const fetchCommand = () => {
    $.ajax({
      type: 'GET',
      url: serverUrl,
      success: (command) => {
        SwimTeam.move(command);
      },
      error: () => {
        console.log('error fetching data from server');
      },
      complete: () => {
        // setTimeout(fetchCommand, 100);
      }
    })
  }
  setTimeout(fetchCommand, 0);
  //
  // TODO: build the swim command fetcher here
  //

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: '/background.jpg',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });



})();

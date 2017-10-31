var getDefaultDueDate = function() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7); // default to 7 days from now
  return tomorrow;
}

$( document ).ready(function() {
  var $inputDate = $('#input_date').pickadate();
  var datePicker = $inputDate.pickadate('picker');
  
  var $inputTime = $('#input_time').pickatime();
  var timePicker = $inputTime.pickatime('picker');
  
  var parseDate = function(value) {
    // FIXME: handle timezones better
    var date = new Date(value)
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    var parsedDate = new Date(date.getTime() + userTimezoneOffset);
    
    console.log('parseDate', value, parsedDate);
    
    if (parsedDate) {
      datePicker.set('select', parsedDate);
      timePicker.set('select', parsedDate);
    }
  }

  var $inputTextDate = $('#input_date_text').on({
    change: parseDate,
    focus: function() {
      datePicker.open(false);
    },
    blur: function() {
      datePicker.close();
    }
  });
  
  var $inputTextTime = $('#input_time_text').on({
    change: parseDate,
    focus: function() {
      timePicker.open(false);
    },
    blur: function() {
      timePicker.close();
    }
  });

  datePicker.on('set', function() {
    console.log('set date', this.get('value'), $inputTextDate.val());
    $inputTextDate.val(this.get('value'));
  });
  
  timePicker.on('set', function() {
    console.log('set time', this.get('value'), $inputTextTime.val());
    $inputTextTime.val(this.get('value'));
  });
  
  var normalizedUrlDate = $inputTextDate.data('value'); // really basic url parsing for now
  var startingValue = normalizedUrlDate || getDefaultDueDate();
  
  parseDate(startingValue); // init with url value or default to tomorrow
  
});
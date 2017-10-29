var getDefaultDueDate = function() {
 var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7); // default to 7 days from now
  return tomorrow.toLocaleDateString();
}

$( document ).ready(function() {
  var $inputDate = $('#input_date').pickadate();
  var picker = $inputDate.pickadate('picker');
  
  var parseDate = function(value) {
    var parsedDate = Date.parse(value);

    if (parsedDate) {
      picker.set('select', [parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()]);
    }
  }

  var $inputText = $('#input_text').on({
    change: parseDate,
    focus: function() {
      picker.open(false);
    },
    blur: function() {
      picker.close();
    }
  });

  picker.on('set', function() {
    console.log('set', this.get('value'), $inputText.val());
    $inputText.val(this.get('value'));
  });
  
  var normalizedUrlDate = $inputText.data('value').replace(/[-_]/g, ' '); // really basic url parsing for now
  var startingValue = normalizedUrlDate || getDefaultDueDate();
  
  parseDate(startingValue); // init with url value or default to tomorrow
  
});
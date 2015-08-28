/**
 * Created by sullenboom on 27/08/15.
 */

var fileReader = function(jQuery) {
    return {
        init: function() {
            jQuery('#form').change(
                fileReader.readMetaData
            );
            jQuery('button').click(
                fileReader.read
            );
        },

        readMetaData: function(event) {
            var files = event.target.files;
            var meta = jQuery('#meta').append( jQuery('<ul>') );
            meta.text('');
            for (var i = 0, file; file = files[i]; i++) {
                meta.append(
                    '<li><strong>' + escape(file.name) + '</strong> (' + (file.type || 'n/a') + ') - ' +
                    file.size + ' bytes, last modified: ' +
                    (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') +
                    '</li>'
                );
                if (file.type.match('image.*')) {
                    fileReader._images(file);
                }
            }
        },

        read: function(event) {
            var files = jQuery('#form').get(0).files;
            if (!files.length) {
                jQuery('#meta').text('Please add one or more files');
                return;
            }
            for (var i = 0, file; file = files[i]; i++) {
                if (file.type.match('csv.*')) {
                    fileReader._csv(file);
                }
            }
            return false;
        },

        _images: function(image) {
            var reader = new FileReader();

            reader.onload = (function(file) {
                return function(e) {
                    jQuery('#images').append(
                        ['<img class="thumb" src="', e.target.result,
                            '" title="', file.name, '"/>'].join('')
                    );
                };
            })(image);
            reader.readAsDataURL(image);
        },

        _csv: function(file) {
            var reader = new FileReader();

            reader.onload = (function(file) {
                return function(e) {
                    var string = e.target.result;
                    if(jQuery('#list').html() != "") {
                        jQuery('#list').append('<hr>');
                    }
                    jQuery('#list').append(string.csvToArray());
                };
            })(file);
            reader.readAsText(file);
        }
    }

}(jQuery);

jQuery(document).ready(function () {
    fileReader.init();
});

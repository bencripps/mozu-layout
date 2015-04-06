!(function($, win, doc) {

    var DropzoneManager, DropZone, Row, Column, dropzoneManager;

    DropzoneManager = function() {
        this.dzContainer = 'dropzone-container';
        this.dzClassName = 'dropzone';
        this.rowClassName = 'row';
        this.colClassName = 'col';
        this.showtools = true;
    };

    DropZone = function(el) {
        this.$element = $(el);
    };

    Row = function() {
        this.$element = $('<div>').attr('class', dropzoneManager.rowClassName);
    };

    Column = function() {
        this.$element = $('<div>').attr('class', dropzoneManager.colClassName);
    };
        
    dropzoneManager = new DropzoneManager();

    DropzoneManager.prototype.initDropzones = function() {

        var self = this,
            newDz;

        $('.' + this.dzContainer).each(function(i, el){ 
            newDz = self.getNewDropZone(self);
            $(el).append(newDz.$element);
        });

        $('input[type="checkbox"]').on('change', this.toggleToolsets.bind(this));
    };

    DropzoneManager.prototype.toggleToolsets = function(){
        $('.dz-tools').toggle();
        this.adjustDZBorders();
        this.showtools = !this.showtools;
    };

    DropzoneManager.prototype.adjustDZBorders = function() {
        //todo make this css classes, not javascript
        if (!this.showtools) {
            $('.dropzone').css('border', '1px solid gray');
        }
        else {
            $('.dropzone').css('border', 'none');
            $('.dropzone:not(:has(.dropzone))').css('border', '1px solid gray');
        }
    };

    DropzoneManager.prototype.getNewDropZone = function(parent) {
        var dz = new DropZone($('<div>').attr('class', this.dzClassName));
        dz.parent = parent;
        dz.init();
        return dz;
    };
    
    DropZone.prototype.init = function() {
        this.addTools();
    };

    DropZone.prototype.insertRow = function() {

        //if there are no dropzones
        if (!this.hasChildren('any')) {
            this.row = new Row();
            this.doInsertRow();
            this.$element.append(this.row.$element);
        }

        else {
            this.doInsertRow();
        }
    };

    DropZone.prototype.insertCol = function() {

        var col;

        if (this.row || this.hasChildren('any-row')) {

            //if there is a row, but no columns, need to add existing content to col, and create empty col
            if (this.hasChildren.call(this.row, 'col').length === 0) {
                for (var i=0; i<=1; i++) {
                    if (i === 0) {
                        col = new Column();
                        this.col = col;
                        this.row.$element.wrap(col.$element);
                    }
                    else {
                        this.doInsertCol();
                    }
                }
            
            }

            else {
                this.doInsertCol();
                this.row.rebase();
            }

        }

        else {
            this.row = new Row();
            for (var z = 0; z<=1; z++) {
                this.doInsertCol();
            }
            this.$element.append(this.row.$element);
        }

    };

    DropZone.prototype.doInsertRow = function() {
        var newDz = dropzoneManager.getNewDropZone(this),
            col = new Column();

        newDz.col = col;
        col.$element.css('width', '100%');
        col.$element.append(newDz.$element);
        this.row.$element.append(col.$element);
    };

    DropZone.prototype.doInsertCol = function() {
        var col = new Column(),
            newDz = dropzoneManager.getNewDropZone(this);

        newDz.col = col;
        col.$element.append(newDz.$element);
        this.row.$element.append(col.$element);
    };
 
    DropZone.prototype.hasChildren = function(type) {

        switch (type) {

            case 'col':
                return this.$element.find('> .' + dropzoneManager.colClassName);

            case 'any-row':
                return this.$element.find('> .' + dropzoneManager.rowClassName).length > 0;

            case 'any':
                return this.$element.find('.' + dropzoneManager.dzClassName).length > 0;

            case 'num':
                return this.$element.find('.' + dropzoneManager.dzClassName).length;
        }
       
    };

    DropZone.prototype.remove = function() {
        var emptyParent = this.$element.parent();

        if (this.parent.hasChildren('num') === 1) {
            this.resetParent();
        }

        else {
            // if the element being deleted is the only element in it's container (row or col)
            if (emptyParent.hasClass('col') || emptyParent.hasClass('row')) emptyParent.remove();
            this.$element.remove();
            this.parent.row.rebase();
        }   
    };

    DropZone.prototype.resetParent = function() {
        this.parent.$element.html('');
        this.parent.addTools();
        this.parent.row = undefined;
    };

    DropZone.prototype.addTools = function() {

        this.toolset = $('<div class="dz-tools">')
                            .append(
                                $('<span>').html('<i class="fa fa-list"></i>').attr('class', 'add-row').on('click', this.insertRow.bind(this)),
                                $('<span>').html('<i class="fa fa-columns"></i>').attr('class', 'add-col').on('click', this.insertCol.bind(this)));

        if (this.parent instanceof DropZone) {
            this.toolset
                    .append(
                        $('<span>').html('<i class="fa fa-edit"></i>').attr('class', 'edit-dz').on('click', this.edit.bind(this)),
                        $('<span>').html('<i class="fa fa-remove"></i>').attr('class', 'delete-dz').on('click', this.remove.bind(this)));
        }

        this.toolset.css('display', dropzoneManager.showtools ? 'block' : 'none');
        this.$element.append(this.toolset); 
    };

    DropZone.prototype.edit = function() {
        console.log(this);
    };

    Row.prototype.rebase = function() {
        var cols = this.$element.find('> .col');
        cols.animate({'width': (1 / cols.length) * 100 + '%'});
    };

    $(doc).on('ready', function() {
        dropzoneManager.initDropzones();
    });

})(jQuery, window, document);
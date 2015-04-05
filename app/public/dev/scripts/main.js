!(function($, win, doc) {

    var DropzoneManager, DropZone, Row, Column, dropzoneManager;

    DropzoneManager = function() {
        this.dzContainer = '.dropzone-container';
        this.dzClassName = 'dropzone';
        this.rowClassName = 'row';
        this.colClassName = 'col';
        this.showtools = true;
    };

    DropZone = function(el) {
        this.$element = $(el);
    };

    Row = function() {
        this.$element = $('<div>').attr('class', 'row');
    };

    Column = function() {
        this.$element = $('<div>').attr('class', 'col');
    };
        
    dropzoneManager = new DropzoneManager();

    DropzoneManager.prototype.initDropzones = function() {

        var self = this;

        $(this.dzContainer).each(function(i, el){ 
            var dz = self.getNewDropZone(self);
            $(el).append(dz.$element);
        });

        $('input[type="checkbox"]').on('change', this.toggleToolsets.bind(this));
    };

    DropzoneManager.prototype.toggleToolsets = function(){
        $('.dz-tools').toggle();
        this.showtools = !this.showtools;
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

        var newDz;

        //if there are no dropzones
        if (!this.hasChildren('any')) {
            this.row = new Row();
            for (var i =0; i<=1; i++) {
                newDz = dropzoneManager.getNewDropZone(this);
                this.row.$element.append(newDz.$element);
            }
            this.$element.append(this.row.$element);
        }

        else {
            newDz = dropzoneManager.getNewDropZone(this);
            this.row.$element.append(newDz.$element);
        }
    };

    DropZone.prototype.insertCol = function() {

        var col,
            newDz;

        //if there is a row, need to add that content to the column
        if (this.row) {
            col = new Column();
            newDz = dropzoneManager.getNewDropZone(this);
            col.$element.append(newDz.$element);
            this.row.$element.append(col.$element);
            this.row.rebase();
        }

        else {
            this.row = new Row();
            for (var i =0; i<=1; i++) {
                col = new Column();
                newDz = dropzoneManager.getNewDropZone(this);
                newDz.col = col;
                col.$element.append(newDz.$element);
                this.row.$element.append(col.$element);
            }
            this.$element.append(this.row.$element);
        }

    };

    DropZone.prototype.hasChildren = function(type) {
        switch (type) {

            case 'col':
                return this;

            case 'row':
                return this;

            case 'any':
                return this.$element.find('.' + dropzoneManager.dzClassName).length > 0;

            case 'num':
                return this.$element.find('.' + dropzoneManager.dzClassName).length;
        }
       
    };

    DropZone.prototype.findRow = function() {
        return this.$element.find('.row');
    };

    DropZone.prototype.remove = function() {
        if (this.parent.hasChildren('num') === 1) {
            this.resetParent();
        }

        else {
            if (this.col) this.col.$element.remove();
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

        this.toolset = $('<div class="dz-tools">').append(
                            $('<span>').html('<i class="fa fa-list"></i>').attr('class', 'add-row').on('click', this.insertRow.bind(this)),
                            $('<span>').html('<i class="fa fa-columns"></i>').attr('class', 'add-col').on('click', this.insertCol.bind(this)));

        if (this.parent instanceof DropZone) {
            this.toolset.append($('<span>').html('<i class="fa fa-remove"></i>').attr('class', 'delete-dz').on('click', this.remove.bind(this)));
        }

        this.toolset.css('display', dropzoneManager.showtools ? 'block' : 'none');
        this.$element.append(this.toolset); 
    };

    Row.prototype.rebase = function() {
        var cols = this.$element.find('> .col');

        cols.css('width', (1 / cols.length) * 100 + '%');
    };

    $(doc).on('ready', function() {
        dropzoneManager.initDropzones();
    });

})(jQuery, window, document);
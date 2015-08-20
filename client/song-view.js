var SectionNameView = View({
    type: 'SectionNameView',
    model: 'section',
    render: function () {
        this.$el.text(this.section.name());
    }
});

var SectionChordView = View({
    type: 'SectionChordView',
    model: 'chord',
    init: function (model) {
        this.create('selected', false);
        this.on('change', function () {
            this.render();
        }, this);
        if(this.chord.length === 2) {
            this.$el.addClass('SectionChordView2Beat');
        }
        if(this.chord.length === 4) {
            this.$el.addClass('SectionChordView4Beat');
        }
    },
    render: function () {
        if(this.selected()) {
            this.$el.addClass('SectionChordViewSelected');
        } else {
            this.$el.removeClass('SectionChordViewSelected');
        }
        this.$el.text(this.chord.value);
    }
});

var SectionChordsView = View({
    type: 'SectionChordsView',
    contains: 'SectionChordView',
    model: 'section',
    init: function (model) {
        var chords = this.section.chords();
        for(var i = 0; i < chords.length; i++) {
            this.add(new SectionChordView(chords.at(i)));
        }
        this.start();
    },
    render: function () {
        return this.$el.html(this.map(function (chordView) {
            return chordView.$el;
        }));
    },
    chordFinished: function () {
        this.current().selected(false);
        var next = this.next();
        if(next) {
            next.selected(true);
        }
        return !!next;
    },
    select: function (i) {
        if(this.current(i))
            return this.current(i).selected();
    }
});

var SongSectionView = View({
    type: 'SongSectionView',
    model: 'section',
    init: function () {
        this.create('name', new SectionNameView(this.section));
        this.create('chords', new SectionChordsView(this.section));
    },
    render: function () {
        var html = [
            this.name().$el,
            this.chords().$el
        ];
        return this.$el.html(html);
    },
    chordFinished: function () {
        return this.chords().chordFinished();
    },
    select: function () {
        this.chords().current(0).selected();
    }
});

var ChordViews = Model({
    contains: 'SectionChordView'
});

var SongView = View({
    type: 'SongView',
    model: 'songInfo',
    contains: 'SongSectionView',
    init: function (model) {
        this.create('fileInfo', new FileInfoView(this.songInfo));
        this.create('chords', new ChordViews());
        if(this.songInfo) {
            this.songInfo.each(function (section) {
                var ssv = new SongSectionView(section);
                this.add(ssv);
                ssv.chords().each(function (chordsView) {
                    this.chords().add(chordsView);
                }, this);
            }, this);
            this.start().select();
            this.chords().start().selected(true);
        }
    },
    render: function () {
        var html = this.map(function (songSection) {
            return songSection.$el;
        });

        html.unshift(this.fileInfo().$el);
        return this.$el.html(html);
    },

    beat: function (e) {
    },
    measure: function (e) {
        if(e === 0) {
            this.chords().map(function (cv) {
                cv.selected(false, false);
            });
            this.chords().start().select();
        }
    },
    chordFinished: function (e) {
        this.chords().map(function (cv) {
            cv.selected(false, false);
        });
        this.chords().next().selected(true);
    }
});

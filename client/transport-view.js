var ControlsView = View({
    type: 'ControlsView',
    model: 'app',
    init: function (model) {
        this.create('instrumentSelect', new InstrumentSelectView(app.instruments()));
        this.create('playback', new PlaybackView(app));
        this.create('volume', new VolumeView(app));
    },
    render: function () {
        var html = [
            this.instrumentSelect().$el,
            this.playback().$el,
            this.volume().$el
        ]
        this.$el.html(html);
    }
});

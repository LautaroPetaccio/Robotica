<div id="maps-modal" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Lista de mapas</h4>
      </div>
      <div class="modal-body">
        <ul class="media-list">
        {% for map in maps %}
          <li class="media">
            <div class="media-left">
              <a href="#">
                <img class="media-object" width="64px" height="64px" src="{{ thumbnailsDirectory + map.name + '/' + map.name }}.png" alt="{{ map.name }}">
              </a>
            </div>
            <div class="media-body">
              <h4 class="media-heading">{{ map.title }}</h4>
                {{ map.description }}
              </div>
          </li>
        {% endfor %}
        </ul>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

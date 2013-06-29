/**
 * This class contains data for the side-tabs in the Vanilla section (e.g. 'Armor', 'Art' etc.)
 */

function TextureCategory(parameters) {
	this.id           = parameters.id;           // Type int
	this.groups       = parameters.groups;       // Type array (containing textureGroups)
	this.categoryName = parameters.categoryName; // Type string

	this.calculateHtmlData();
}

TextureCategory.prototype.select = function(groups) {
	this.tabElements.link.tab('show');
}

TextureCategory.prototype.setGroups = function(groups) {
	this.groups = groups;
	this.resetGroupElements();
}

TextureCategory.prototype.calculateHtmlData = function() {
	var that = this;

	this.tabElements = {};
	var tabElements = this.tabElements;
	tabElements.container = $("<li>")
	tabElements.link = $("<a data-toggle='tab' href='#category-"+this.id+"'>")
		.text(this.categoryName)
		.appendTo(tabElements.container);

	this.contentElements = {};
	var contentElements = this.contentElements;
	contentElements.container = $("<div class='tab-pane' id='category-"+this.id+"'>");
	contentElements.groups = $("<div>").appendTo(contentElements.container);

	$('<hr class="edit">')
		.hide()
		.appendTo(contentElements.container);
	contentElements.addButton = $("<button class='btn btn-large edit btn-add-group'>Add a group</button>")
		.hide()
		.appendTo(contentElements.container)
		.click(function() {
			that.showUploadForm();
		});

	this.resetGroupElements();
}

// Called when a texture is added/deleted/modified
TextureCategory.prototype.resetGroupElements = function() {
	this.contentElements.groups.empty();
	for (var i in this.groups) {
		this.contentElements.groups.append(this.groups[i].getHtml());
	}
}

TextureCategory.prototype.getTabHtml = function () {
	return this.tabElements.container;
}

TextureCategory.prototype.getContentHtml = function () {
	return this.contentElements.container;
}

TextureCategory.prototype.showUploadForm = function() {
	var that = this;

	var modal = null;
	$.ajax({
		async: false,
		type: "GET",
		cache: false,
		url: CATEGORY_MODAL_PATH+"template.html",
		success: function(data) {
			modal = $(data);

			modal.find(".modal-inline h5").text("to "+that.categoryName);

			var select = modal.find("#option-type");
			for (i in GROUP_TYPES) {
				name = GROUP_TYPES[i].typeName;
				select.append("<option value='"+i+"'>"+name+"</option>");
			}
			select.change(function() {
				var form = modal.find("#custom-form");
				form.fadeOut("fast", function() {
					form.empty();

					groupType = GROUP_TYPES[select.val()];
					$.ajax({
						type: "GET",
						cache: false,
						url: CATEGORY_MODAL_PATH+groupType.groupModalPath,
						success: function(data) {
							form.html(data);
							form.fadeIn("fast");
						}
					});
				});

			});

			modal.find(".btn-submit").click(function() {

			})
			modal.find(".modal-close").click(function() {
				modal.modal("hide");
			});
		}
	});

	modal.modal("show");
}
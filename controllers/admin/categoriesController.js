// Get Category model
var Category = require('../../models/category');

exports.index = function (req, res) {
    Category.find(function (err, categories) {
        if (err)
            return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
};

exports.add_cate_post = function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('danger', errors);
        res.redirect('/admin/categories');
    } else {
        Category.findOne({
            slug: slug
        }, function (err, category) {
            if (category) {
                req.flash('danger', 'Danh mục đã tồn tại');
                res.redirect('/admin/categories');
            } else {
                var category = new Category({
                    title: title,
                    slug: slug
                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);

                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    });

                    req.flash('success', 'Danh mục đã được thêm');
                    res.redirect('/admin/categories');
                });
            }
        });
    }

};

exports.edit_cate_get = function (req, res) {

    Category.findById(req.params.id, function (err, category) {
        if (err)
            return console.log(err);
        res.send(category);
    });

};

exports.edit_cate_post = function (req, res) {

    req.checkBody('title', 'Tên danh mục không được rỗng').notEmpty();
    req.checkBody('slug', 'Đường dẫn không được rỗng').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/cate', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findOne({
            slug: slug,
            _id: {
                '$ne': id
            }
        }, function (err, category) {
            if (category) {
                req.flash('danger', 'Danh mục đã tồn tại');
                res.redirect('/admin/categories');
            } else {
                Category.findById(id, function (err, category) {
                    if (err)
                        return console.log(err);

                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err)
                            return console.log(err);

                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });

                        req.flash('success', 'Danh mục đã được chỉnh sửa!');
                        res.redirect('/admin/categories');
                    });

                });


            }
        });
    }

};

exports.delete_cate_post = function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });

        req.flash('success', 'Danh mục đã được xóa!');
        res.redirect('/admin/categories');
    });
};
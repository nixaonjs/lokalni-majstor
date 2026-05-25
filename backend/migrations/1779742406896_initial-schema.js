exports.up = (pgm) => {
    pgm.createTable('users', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'varchar', notNull: true },
        email: { type: 'varchar', notNull: true, unique: true },
        password: { type: 'text', notNull: true },
        role: { type: 'varchar', default: 'korisnik' },
        is_verified: { type: 'boolean', default: false },
    });

    pgm.createTable('ads', {
        id: { type: 'serial', primaryKey: true },
        user_id: { type: 'integer' },
        title: { type: 'varchar', notNull: true },
        description: { type: 'text' },
        location: { type: 'varchar' },
        category: { type: 'varchar' },
        image_url: { type: 'text' },
        created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
        owner_id: { type: 'integer' },
        price: { type: 'integer' },
        status: { type: 'varchar', notNull: true, default: 'active' },
        subcategory: { type: 'varchar' },
        main_category: { type: 'varchar' },
    });

    pgm.createTable('favorites', {
        user_id: { type: 'integer', notNull: true },
        ad_id: { type: 'integer', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    })

    pgm.createTable('ad_views', {
        id: { type: 'bigserial', primaryKey: true },
        ad_id: { type: 'bigint', notNull: true },
        viewer_user_id: { type: 'bigint' },
        fingerprint: { type: 'varchar' },
        viewed_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('ad_views');
    pgm.dropTable('favorites');
    pgm.dropTable('ads');
    pgm.dropTable('users');
};
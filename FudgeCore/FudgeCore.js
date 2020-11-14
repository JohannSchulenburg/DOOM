"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FudgeCore;
(function (FudgeCore) {
    /**
     * Base class for the different DebugTargets, mainly for technical purpose of inheritance
     */
    class DebugTarget {
        static mergeArguments(_message, ..._args) {
            let out = _message.toString(); //JSON.stringify(_message);
            for (let arg of _args)
                if (arg instanceof Number)
                    out += ", " + arg.toPrecision(2).toString(); //JSON.stringify(arg, null, 2);
                else
                    out += ", " + arg.toString(); //JSON.stringify(arg, null, 2);
            return out;
        }
    }
    FudgeCore.DebugTarget = DebugTarget;
})(FudgeCore || (FudgeCore = {}));
// <reference path="DebugAlert.ts"/>
var FudgeCore;
// <reference path="DebugAlert.ts"/>
(function (FudgeCore) {
    /**
     * The filters corresponding to debug activities, more to come
     */
    let DEBUG_FILTER;
    (function (DEBUG_FILTER) {
        DEBUG_FILTER[DEBUG_FILTER["NONE"] = 0] = "NONE";
        DEBUG_FILTER[DEBUG_FILTER["INFO"] = 1] = "INFO";
        DEBUG_FILTER[DEBUG_FILTER["LOG"] = 2] = "LOG";
        DEBUG_FILTER[DEBUG_FILTER["WARN"] = 4] = "WARN";
        DEBUG_FILTER[DEBUG_FILTER["ERROR"] = 8] = "ERROR";
        DEBUG_FILTER[DEBUG_FILTER["FUDGE"] = 16] = "FUDGE";
        DEBUG_FILTER[DEBUG_FILTER["CLEAR"] = 256] = "CLEAR";
        DEBUG_FILTER[DEBUG_FILTER["GROUP"] = 257] = "GROUP";
        DEBUG_FILTER[DEBUG_FILTER["GROUPCOLLAPSED"] = 258] = "GROUPCOLLAPSED";
        DEBUG_FILTER[DEBUG_FILTER["GROUPEND"] = 260] = "GROUPEND";
        DEBUG_FILTER[DEBUG_FILTER["MESSAGES"] = 31] = "MESSAGES";
        DEBUG_FILTER[DEBUG_FILTER["FORMAT"] = 263] = "FORMAT";
        DEBUG_FILTER[DEBUG_FILTER["ALL"] = 287] = "ALL";
    })(DEBUG_FILTER = FudgeCore.DEBUG_FILTER || (FudgeCore.DEBUG_FILTER = {}));
    FudgeCore.DEBUG_SYMBOL = {
        [DEBUG_FILTER.INFO]: "✓",
        [DEBUG_FILTER.LOG]: "✎",
        [DEBUG_FILTER.WARN]: "⚠",
        [DEBUG_FILTER.ERROR]: "❌",
        [DEBUG_FILTER.FUDGE]: "🎲"
    };
})(FudgeCore || (FudgeCore = {}));
// / <reference path="DebugTarget.ts"/>
var FudgeCore;
// / <reference path="DebugTarget.ts"/>
(function (FudgeCore) {
    /**
     * Routing to the standard-console
     */
    class DebugConsole extends FudgeCore.DebugTarget {
        /**
         * Displays critical information about failures, which is emphasized e.g. by color
         */
        static fudge(_message, ..._args) {
            console.debug("🎲", _message, ..._args);
            // let trace: string[] = new Error("Test").stack.split("\n");
            // console.log(trace[4]);
            // console.trace("Test");
        }
    }
    DebugConsole.delegates = {
        [FudgeCore.DEBUG_FILTER.INFO]: console.info,
        [FudgeCore.DEBUG_FILTER.LOG]: console.log,
        [FudgeCore.DEBUG_FILTER.WARN]: console.warn,
        [FudgeCore.DEBUG_FILTER.ERROR]: console.error,
        [FudgeCore.DEBUG_FILTER.FUDGE]: DebugConsole.fudge,
        [FudgeCore.DEBUG_FILTER.CLEAR]: console.clear,
        [FudgeCore.DEBUG_FILTER.GROUP]: console.group,
        [FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED]: console.groupCollapsed,
        [FudgeCore.DEBUG_FILTER.GROUPEND]: console.groupEnd
    };
    FudgeCore.DebugConsole = DebugConsole;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="DebugTarget.ts"/>
/// <reference path="DebugInterfaces.ts"/>
/// <reference path="DebugConsole.ts"/>
var FudgeCore;
// / <reference path="DebugTarget.ts"/>
/// <reference path="DebugInterfaces.ts"/>
/// <reference path="DebugConsole.ts"/>
(function (FudgeCore) {
    /**
     * The Debug-Class offers functions known from the console-object and additions,
     * routing the information to various [[DebugTargets]] that can be easily defined by the developers and registerd by users
     * Override functions in subclasses of [[DebugTarget]] and register them as their delegates
     */
    class Debug {
        // TODO: create filter DEBUG_FILTER.FUDGE solely for messages from FUDGE
        /**
         * De- / Activate a filter for the given DebugTarget.
         */
        static setFilter(_target, _filter) {
            for (let filter in Debug.delegates)
                Debug.delegates[filter].delete(_target);
            for (let filter in FudgeCore.DEBUG_FILTER) {
                let parsed = parseInt(filter);
                if (isNaN(parsed))
                    break;
                if ([FudgeCore.DEBUG_FILTER.MESSAGES, FudgeCore.DEBUG_FILTER.FORMAT, FudgeCore.DEBUG_FILTER.ALL].indexOf(parsed) != -1)
                    // dont delegate combos... 
                    continue;
                if (_filter & parsed)
                    Debug.delegates[parsed].set(_target, _target.delegates[parsed]);
            }
        }
        /**
         * Info(...) displays additional information with low priority
         */
        static info(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.INFO, _message, _args);
        }
        /**
         * Displays information with medium priority
         */
        static log(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.LOG, _message, _args);
        }
        /**
         * Displays information about non-conformities in usage, which is emphasized e.g. by color
         */
        static warn(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.WARN, _message, _args);
        }
        /**
         * Displays critical information about failures, which is emphasized e.g. by color
         */
        static error(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.ERROR, _message, _args);
        }
        /**
         * Displays messages from FUDGE
         */
        static fudge(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.FUDGE, _message, _args);
        }
        /**
         * Clears the output and removes previous messages if possible
         */
        static clear() {
            Debug.delegate(FudgeCore.DEBUG_FILTER.CLEAR, null, null);
        }
        /**
         * Opens a new group for messages
         */
        static group(_name) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.GROUP, _name, null);
        }
        /**
         * Opens a new group for messages that is collapsed at first
         */
        static groupCollapsed(_name) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED, _name, null);
        }
        /**
         * Closes the youngest group
         */
        static groupEnd() {
            Debug.delegate(FudgeCore.DEBUG_FILTER.GROUPEND, null, null);
        }
        /**
         * Lookup all delegates registered to the filter and call them using the given arguments
         */
        static delegate(_filter, _message, _args) {
            let delegates = Debug.delegates[_filter];
            for (let delegate of delegates.values())
                if (delegate)
                    if (_args && _args.length > 0)
                        delegate(_message, ..._args);
                    else
                        delegate(_message);
        }
        /**
         * setup routing to standard console
         */
        static setupConsole() {
            let result = {};
            let filters = [
                FudgeCore.DEBUG_FILTER.INFO, FudgeCore.DEBUG_FILTER.LOG, FudgeCore.DEBUG_FILTER.WARN, FudgeCore.DEBUG_FILTER.ERROR, FudgeCore.DEBUG_FILTER.FUDGE,
                FudgeCore.DEBUG_FILTER.CLEAR, FudgeCore.DEBUG_FILTER.GROUP, FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED, FudgeCore.DEBUG_FILTER.GROUPEND
            ];
            for (let filter of filters)
                result[filter] = new Map([[FudgeCore.DebugConsole, FudgeCore.DebugConsole.delegates[filter]]]);
            return result;
        }
    }
    /**
     * For each set filter, this associative array keeps references to the registered delegate functions of the chosen [[DebugTargets]]
     */
    Debug.delegates = Debug.setupConsole();
    FudgeCore.Debug = Debug;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventTargetƒ extends EventTarget {
        addEventListener(_type, _handler, _options) {
            super.addEventListener(_type, _handler, _options);
        }
        removeEventListener(_type, _handler, _options) {
            super.removeEventListener(_type, _handler, _options);
        }
        dispatchEvent(_event) {
            return super.dispatchEvent(_event);
        }
    }
    FudgeCore.EventTargetƒ = EventTargetƒ;
    /**
     * Base class for EventTarget singletons, which are fixed entities in the structure of Fudge, such as the core loop
     */
    class EventTargetStatic extends EventTargetƒ {
        constructor() {
            super();
        }
        static addEventListener(_type, _handler) {
            EventTargetStatic.targetStatic.addEventListener(_type, _handler);
        }
        static removeEventListener(_type, _handler) {
            EventTargetStatic.targetStatic.removeEventListener(_type, _handler);
        }
        static dispatchEvent(_event) {
            EventTargetStatic.targetStatic.dispatchEvent(_event);
            return true;
        }
    }
    EventTargetStatic.targetStatic = new EventTargetStatic();
    FudgeCore.EventTargetStatic = EventTargetStatic;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    // export interface MutatorForComponent extends Mutator { readonly forUserComponent: null; }
    /**
     * Collect applicable attributes of the instance and copies of their values in a Mutator-object
     */
    function getMutatorOfArbitrary(_object) {
        let mutator = {};
        let attributes = Reflect.ownKeys(Reflect.getPrototypeOf(_object));
        for (let attribute of attributes) {
            let value = Reflect.get(_object, attribute);
            if (value instanceof Function)
                continue;
            // if (value instanceof Object && !(value instanceof Mutable))
            //   continue;
            mutator[attribute.toString()] = value;
        }
        return mutator;
    }
    FudgeCore.getMutatorOfArbitrary = getMutatorOfArbitrary;
    /**
     * Base class for all types being mutable using [[Mutator]]-objects, thus providing and using interfaces created at runtime.
     * Mutables provide a [[Mutator]] that is build by collecting all object-properties that are either of a primitive type or again Mutable.
     * Subclasses can either reduce the standard [[Mutator]] built by this base class by deleting properties or implement an individual getMutator-method.
     * The provided properties of the [[Mutator]] must match public properties or getters/setters of the object.
     * Otherwise, they will be ignored if not handled by an override of the mutate-method in the subclass and throw errors in an automatically generated user-interface for the object.
     */
    class Mutable extends FudgeCore.EventTargetƒ {
        /**
         * Decorator allows to attach [[Mutable]] functionality to existing classes.
         */
        // public static decorate(_constructor: Function): void {
        //   Object.defineProperty(_constructor.prototype, "useRenderData", {
        //     value: function getMutator(this: MutableForUserInterface): Mutator {
        //       return getMutatorOfArbitrary(this);
        //     }
        //   });
        // }
        /**
         * Retrieves the type of this mutable subclass as the name of the runtime class
         * @returns The type of the mutable
         */
        get type() {
            return this.constructor.name;
        }
        /**
         * Collect applicable attributes of the instance and copies of their values in a Mutator-object.
         * By default, a mutator cannot extended, since extensions are not available in the object the mutator belongs to.
         * A mutator may be reduced by the descendants of [[Mutable]] to contain only the properties needed.
         */
        getMutator(_extendable = false) {
            let mutator = {};
            // collect primitive and mutable attributes
            for (let attribute in this) {
                let value = this[attribute];
                if (value instanceof Function)
                    continue;
                if (value instanceof Object && !(value instanceof Mutable) && !(value.hasOwnProperty("idResource")))
                    continue;
                mutator[attribute] = this[attribute];
            }
            if (!_extendable)
                // mutator can be reduced but not extended!
                Object.preventExtensions(mutator);
            // delete unwanted attributes
            this.reduceMutator(mutator);
            // replace references to mutable objects with references to copies
            for (let attribute in mutator) {
                let value = mutator[attribute];
                if (value instanceof Mutable)
                    mutator[attribute] = value.getMutator();
            }
            return mutator;
        }
        /**
         * Collect the attributes of the instance and their values applicable for animation.
         * Basic functionality is identical to [[getMutator]], returned mutator should then be reduced by the subclassed instance
         */
        getMutatorForAnimation() {
            return this.getMutator();
        }
        /**
         * Collect the attributes of the instance and their values applicable for the user interface.
         * Basic functionality is identical to [[getMutator]], returned mutator should then be reduced by the subclassed instance
         */
        getMutatorForUserInterface() {
            return this.getMutator();
        }
        /**
         * Collect the attributes of the instance and their values applicable for indiviualization by the component.
         * Basic functionality is identical to [[getMutator]], returned mutator should then be reduced by the subclassed instance
         */
        // public getMutatorForComponent(): MutatorForComponent {
        //     return <MutatorForComponent>this.getMutator();
        // }
        /**
         * Returns an associative array with the same attributes as the given mutator, but with the corresponding types as string-values
         * Does not recurse into objects!
         * @param _mutator
         */
        getMutatorAttributeTypes(_mutator) {
            let types = {};
            for (let attribute in _mutator) {
                let type = null;
                let value = _mutator[attribute];
                if (_mutator[attribute] != undefined)
                    if (typeof (value) == "object")
                        type = this[attribute].constructor.name;
                    else if (typeof (value) == "function")
                        type = value["name"];
                    else
                        type = _mutator[attribute].constructor.name;
                types[attribute] = type;
            }
            return types;
        }
        /**
         * Updates the values of the given mutator according to the current state of the instance
         * @param _mutator
         */
        updateMutator(_mutator) {
            for (let attribute in _mutator) {
                let value = _mutator[attribute];
                if (value instanceof Mutable)
                    value = value.getMutator();
                else
                    _mutator[attribute] = this[attribute];
            }
        }
        /**
         * Updates the attribute values of the instance according to the state of the mutator. Must be protected...!
         * @param _mutator
         */
        async mutate(_mutator) {
            for (let attribute in _mutator) {
                if (!Reflect.has(this, attribute))
                    continue;
                let mutant = Reflect.get(this, attribute);
                let value = _mutator[attribute];
                if (mutant instanceof Mutable)
                    await mutant.mutate(value);
                else
                    Reflect.set(this, attribute, value);
            }
            this.dispatchEvent(new Event("mutate" /* MUTATE */));
        }
    }
    FudgeCore.Mutable = Mutable;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Handles the external serialization and deserialization of [[Serializable]] objects. The internal process is handled by the objects themselves.
     * A [[Serialization]] object can be created from a [[Serializable]] object and a JSON-String may be created from that.
     * Vice versa, a JSON-String can be parsed to a [[Serialization]] which can be deserialized to a [[Serializable]] object.
     * ```plaintext
     *  [Serializable] → (serialize) → [Serialization] → (stringify)
     *                                                        ↓
     *                                                    [String]
     *                                                        ↓
     *  [Serializable] ← (deserialize) ← [Serialization] ← (parse)
     * ```
     * While the internal serialize/deserialize methods of the objects care of the selection of information needed to recreate the object and its structure,
     * the [[Serializer]] keeps track of the namespaces and classes in order to recreate [[Serializable]] objects. The general structure of a [[Serialization]] is as follows
     * ```plaintext
     * {
     *      namespaceName.className: {
     *          propertyName: propertyValue,
     *          ...,
     *          propertyNameOfReference: SerializationOfTheReferencedObject,
     *          ...,
     *          constructorNameOfSuperclass: SerializationOfSuperClass
     *      }
     * }
     * ```
     * Since the instance of the superclass is created automatically when an object is created,
     * the SerializationOfSuperClass omits the the namespaceName.className key and consists only of its value.
     * The constructorNameOfSuperclass is given instead as a property name in the serialization of the subclass.
     */
    class Serializer {
        /**
         * Registers a namespace to the [[Serializer]], to enable automatic instantiation of classes defined within
         * @param _namespace
         */
        static registerNamespace(_namespace) {
            for (let name in Serializer.namespaces)
                if (Serializer.namespaces[name] == _namespace)
                    return name;
            let name = Serializer.findNamespaceIn(_namespace, window);
            if (!name)
                for (let parentName in Serializer.namespaces) {
                    name = Serializer.findNamespaceIn(_namespace, Serializer.namespaces[parentName]);
                    if (name) {
                        name = parentName + "." + name;
                        break;
                    }
                }
            if (!name)
                throw new Error("Namespace not found. Maybe parent namespace hasn't been registered before?");
            Serializer.namespaces[name] = _namespace;
            return name;
        }
        /**
         * Returns a javascript object representing the serializable FUDGE-object given,
         * including attached components, children, superclass-objects all information needed for reconstruction
         * @param _object An object to serialize, implementing the [[Serializable]] interface
         */
        static serialize(_object) {
            let serialization = {};
            // TODO: save the namespace with the constructors name
            // serialization[_object.constructor.name] = _object.serialize();
            let path = this.getFullPath(_object);
            if (!path)
                throw new Error(`Namespace of serializable object of type ${_object.constructor.name} not found. Maybe the namespace hasn't been registered or the class not exported?`);
            serialization[path] = _object.serialize();
            return serialization;
            // return _object.serialize();
        }
        /**
         * Returns a FUDGE-object reconstructed from the information in the [[Serialization]] given,
         * including attached components, children, superclass-objects
         * @param _serialization
         */
        static async deserialize(_serialization) {
            let reconstruct;
            try {
                // loop constructed solely to access type-property. Only one expected!
                for (let path in _serialization) {
                    // reconstruct = new (<General>Fudge)[typeName];
                    reconstruct = Serializer.reconstruct(path);
                    reconstruct = await reconstruct.deserialize(_serialization[path]);
                    return reconstruct;
                }
            }
            catch (_error) {
                throw new Error("Deserialization failed: " + _error);
            }
            return null;
        }
        //TODO: implement prettifier to make JSON-Stringification of serializations more readable, e.g. placing x, y and z in one line
        static prettify(_json) { return _json; }
        /**
         * Returns a formatted, human readable JSON-String, representing the given [[Serializaion]] that may have been created by [[Serializer]].serialize
         * @param _serialization
         */
        static stringify(_serialization) {
            // adjustments to serialization can be made here before stringification, if desired
            let json = JSON.stringify(_serialization, null, 2);
            let pretty = Serializer.prettify(json);
            return pretty;
        }
        /**
         * Returns a [[Serialization]] created from the given JSON-String. Result may be passed to [[Serializer]].deserialize
         * @param _json
         */
        static parse(_json) {
            return JSON.parse(_json);
        }
        /**
         * Creates an object of the class defined with the full path including the namespaceName(s) and the className seperated by dots(.)
         * @param _path
         */
        static reconstruct(_path) {
            let typeName = _path.substr(_path.lastIndexOf(".") + 1);
            let namespace = Serializer.getNamespace(_path);
            if (!namespace)
                throw new Error(`Namespace of serializable object of type ${typeName} not found. Maybe the namespace hasn't been registered?`);
            // let reconstruction: Serializable = new (<General>namespace)[typeName];
            let constructor = Serializer.getConstructor(typeName, namespace);
            let reconstruction = new constructor();
            return reconstruction;
        }
        static getConstructor(_type, _namespace = FudgeCore) {
            return _namespace[_type];
        }
        /**
         * Returns the full path to the class of the object, if found in the registered namespaces
         * @param _object
         */
        static getFullPath(_object) {
            let typeName = _object.constructor.name;
            // Debug.log("Searching namespace of: " + typeName);
            for (let namespaceName in Serializer.namespaces) {
                let found = Serializer.namespaces[namespaceName][typeName];
                if (found && _object instanceof found)
                    return namespaceName + "." + typeName;
            }
            return null;
        }
        /**
         * Returns the namespace-object defined within the full path, if registered
         * @param _path
         */
        static getNamespace(_path) {
            let namespaceName = _path.substr(0, _path.lastIndexOf("."));
            return Serializer.namespaces[namespaceName];
        }
        /**
         * Finds the namespace-object in properties of the parent-object (e.g. window), if present
         * @param _namespace
         * @param _parent
         */
        static findNamespaceIn(_namespace, _parent) {
            for (let prop in _parent)
                if (_parent[prop] == _namespace)
                    return prop;
            return null;
        }
    }
    /** In order for the Serializer to create class instances, it needs access to the appropriate namespaces */
    Serializer.namespaces = { "ƒ": FudgeCore };
    FudgeCore.Serializer = Serializer;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjector {
        static inject(_constructor, _injector) {
            let injection = Reflect.get(_injector, "inject" + _constructor.name);
            if (!injection) {
                console.error("No injection decorator defined for " + _constructor.name);
            }
            Object.defineProperty(_constructor.prototype, "useRenderData", {
                value: injection
            });
        }
    }
    FudgeCore.RenderInjector = RenderInjector;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorShader {
        static decorate(_constructor) {
            Object.defineProperty(_constructor, "useProgram", {
                value: RenderInjectorShader.useProgram
            });
            Object.defineProperty(_constructor, "deleteProgram", {
                value: RenderInjectorShader.deleteProgram
            });
            Object.defineProperty(_constructor, "createProgram", {
                value: RenderInjectorShader.createProgram
            });
        }
        static useProgram() {
            if (!this.program)
                this.createProgram();
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            crc3.useProgram(this.program);
            crc3.enableVertexAttribArray(this.attributes["a_position"]);
        }
        static deleteProgram() {
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            if (this.program) {
                crc3.deleteProgram(this.program);
                delete this.attributes;
                delete this.uniforms;
            }
        }
        static createProgram() {
            FudgeCore.Debug.fudge("Create shader program", this.name);
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            let program = crc3.createProgram();
            try {
                crc3.attachShader(program, FudgeCore.RenderOperator.assert(compileShader(this.getVertexShaderSource(), WebGL2RenderingContext.VERTEX_SHADER)));
                crc3.attachShader(program, FudgeCore.RenderOperator.assert(compileShader(this.getFragmentShaderSource(), WebGL2RenderingContext.FRAGMENT_SHADER)));
                crc3.linkProgram(program);
                let error = FudgeCore.RenderOperator.assert(crc3.getProgramInfoLog(program));
                if (error !== "") {
                    throw new Error("Error linking Shader: " + error);
                }
                this.program = program;
                this.attributes = detectAttributes();
                this.uniforms = detectUniforms();
            }
            catch (_error) {
                FudgeCore.Debug.error(_error);
                debugger;
            }
            function compileShader(_shaderCode, _shaderType) {
                let webGLShader = crc3.createShader(_shaderType);
                crc3.shaderSource(webGLShader, _shaderCode);
                crc3.compileShader(webGLShader);
                let error = FudgeCore.RenderOperator.assert(crc3.getShaderInfoLog(webGLShader));
                if (error !== "") {
                    throw new Error("Error compiling shader: " + error);
                }
                // Check for any compilation errors.
                if (!crc3.getShaderParameter(webGLShader, WebGL2RenderingContext.COMPILE_STATUS)) {
                    alert(crc3.getShaderInfoLog(webGLShader));
                    return null;
                }
                return webGLShader;
            }
            function detectAttributes() {
                let detectedAttributes = {};
                let attributeCount = crc3.getProgramParameter(program, WebGL2RenderingContext.ACTIVE_ATTRIBUTES);
                for (let i = 0; i < attributeCount; i++) {
                    let attributeInfo = FudgeCore.RenderOperator.assert(crc3.getActiveAttrib(program, i));
                    if (!attributeInfo) {
                        break;
                    }
                    detectedAttributes[attributeInfo.name] = crc3.getAttribLocation(program, attributeInfo.name);
                }
                return detectedAttributes;
            }
            function detectUniforms() {
                let detectedUniforms = {};
                let uniformCount = crc3.getProgramParameter(program, WebGL2RenderingContext.ACTIVE_UNIFORMS);
                for (let i = 0; i < uniformCount; i++) {
                    let info = FudgeCore.RenderOperator.assert(crc3.getActiveUniform(program, i));
                    if (!info) {
                        break;
                    }
                    detectedUniforms[info.name] = FudgeCore.RenderOperator.assert(crc3.getUniformLocation(program, info.name));
                }
                return detectedUniforms;
            }
        }
    }
    FudgeCore.RenderInjectorShader = RenderInjectorShader;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorCoat extends FudgeCore.RenderInjector {
        static decorate(_constructor) {
            FudgeCore.RenderInjector.inject(_constructor, RenderInjectorCoat);
        }
        static injectCoatColored(_shader, _cmpMaterial) {
            let colorUniformLocation = _shader.uniforms["u_color"];
            let color = FudgeCore.Color.MULTIPLY(this.color, _cmpMaterial.clrPrimary);
            FudgeCore.RenderOperator.getRenderingContext().uniform4fv(colorUniformLocation, color.getArray());
        }
        static injectCoatTextured(_shader, _cmpMaterial) {
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            // if (this.renderData) {
            // buffers exist
            // TODO: find a way to use inheritance through decorator, thus calling methods injected in superclass
            let colorUniformLocation = _shader.uniforms["u_color"];
            let color = FudgeCore.Color.MULTIPLY(this.color, _cmpMaterial.clrPrimary);
            FudgeCore.RenderOperator.getRenderingContext().uniform4fv(colorUniformLocation, color.getArray());
            // crc3.activeTexture(WebGL2RenderingContext.TEXTURE0);
            // crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.renderData["texture0"]);
            this.texture.useRenderData();
            crc3.uniform1i(_shader.uniforms["u_texture"], 0);
            crc3.uniformMatrix3fv(_shader.uniforms["u_pivot"], false, _cmpMaterial.pivot.get());
            // }
            // else {
            //   this.renderData = {};
            //   (<CoatTextured>this).texture.useRenderData();
            //   this.useRenderData(_shader, _cmpMaterial);
            // }
        }
        static injectCoatMatCap(_shader, _cmpMaterial) {
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            let colorUniformLocation = _shader.uniforms["u_tint_color"];
            let { r, g, b, a } = this.color;
            let tintColorArray = new Float32Array([r, g, b, a]);
            crc3.uniform4fv(colorUniformLocation, tintColorArray);
            let floatUniformLocation = _shader.uniforms["shade_smooth"];
            let shadeSmooth = this.shadeSmooth;
            crc3.uniform1i(floatUniformLocation, shadeSmooth);
            if (this.renderData) {
                // buffers exist
                crc3.activeTexture(WebGL2RenderingContext.TEXTURE0);
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.renderData["texture0"]);
                crc3.uniform1i(_shader.uniforms["u_texture"], 0);
            }
            else {
                this.renderData = {};
                // TODO: check if all WebGL-Creations are asserted
                const texture = FudgeCore.RenderManager.assert(crc3.createTexture());
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, texture);
                try {
                    crc3.texImage2D(crc3.TEXTURE_2D, 0, crc3.RGBA, crc3.RGBA, crc3.UNSIGNED_BYTE, this.texture.image);
                    crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, this.texture.image);
                }
                catch (_error) {
                    FudgeCore.Debug.error(_error);
                }
                crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.NEAREST);
                crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.NEAREST);
                crc3.generateMipmap(crc3.TEXTURE_2D);
                this.renderData["texture0"] = texture;
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
                this.useRenderData(_shader, _cmpMaterial);
            }
        }
    }
    FudgeCore.RenderInjectorCoat = RenderInjectorCoat;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorMesh {
        static decorate(_constructor) {
            Object.defineProperty(_constructor.prototype, "useRenderBuffers", {
                value: RenderInjectorMesh.useRenderBuffers
            });
            Object.defineProperty(_constructor.prototype, "createRenderBuffers", {
                value: RenderInjectorMesh.createRenderBuffers
            });
            Object.defineProperty(_constructor.prototype, "deleteRenderBuffers", {
                value: RenderInjectorMesh.deleteRenderBuffers
            });
        }
        static createRenderBuffers() {
            // console.log("createRenderBuffers", this);
            // return;
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            let vertices = FudgeCore.RenderOperator.assert(crc3.createBuffer());
            crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, vertices);
            crc3.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, this.vertices, WebGL2RenderingContext.STATIC_DRAW);
            let indices = FudgeCore.RenderOperator.assert(crc3.createBuffer());
            crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, indices);
            crc3.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.indices, WebGL2RenderingContext.STATIC_DRAW);
            let textureUVs = crc3.createBuffer();
            crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, textureUVs);
            crc3.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, this.textureUVs, WebGL2RenderingContext.STATIC_DRAW);
            let normalsFace = FudgeCore.RenderOperator.assert(crc3.createBuffer());
            crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, normalsFace);
            crc3.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, this.normalsFace, WebGL2RenderingContext.STATIC_DRAW);
            let renderBuffers = {
                vertices: vertices,
                indices: indices,
                nIndices: this.getIndexCount(),
                textureUVs: textureUVs,
                normalsFace: normalsFace
            };
            this.renderBuffers = renderBuffers;
        }
        static useRenderBuffers(_shader, _world, _projection, _id) {
            // console.log("useRenderBuffers", this);
            // return;
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            let aPosition = _shader.attributes["a_position"];
            crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderBuffers.vertices);
            crc3.enableVertexAttribArray(aPosition);
            FudgeCore.RenderOperator.setAttributeStructure(aPosition, FudgeCore.Mesh.getBufferSpecification());
            crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.renderBuffers.indices);
            let uProjection = _shader.uniforms["u_projection"];
            crc3.uniformMatrix4fv(uProjection, false, _projection.get());
            // feed in face normals if shader accepts u_world. 
            let uWorld = _shader.uniforms["u_world"];
            if (uWorld) {
                crc3.uniformMatrix4fv(uWorld, false, _world.get());
            }
            let aNormal = _shader.attributes["a_normal"];
            if (aNormal) {
                crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderBuffers.normalsFace);
                crc3.enableVertexAttribArray(aNormal);
                FudgeCore.RenderOperator.setAttributeStructure(aNormal, FudgeCore.Mesh.getBufferSpecification());
            }
            // feed in texture coordinates if shader accepts a_textureUVs
            let aTextureUVs = _shader.attributes["a_textureUVs"];
            if (aTextureUVs) {
                crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderBuffers.textureUVs);
                crc3.enableVertexAttribArray(aTextureUVs); // enable the buffer
                crc3.vertexAttribPointer(aTextureUVs, 2, WebGL2RenderingContext.FLOAT, false, 0, 0);
            }
            // feed in an id of the node if shader accepts u_id. Used for picking
            let uId = _shader.uniforms["u_id"];
            if (uId)
                FudgeCore.RenderOperator.getRenderingContext().uniform1i(uId, _id);
        }
        static deleteRenderBuffers(_renderBuffers) {
            // console.log("deleteRenderBuffers", this);
            // return;
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            if (_renderBuffers) {
                crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, null);
                crc3.deleteBuffer(_renderBuffers.vertices);
                crc3.deleteBuffer(_renderBuffers.textureUVs);
                crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, null);
                crc3.deleteBuffer(_renderBuffers.indices);
            }
        }
    }
    FudgeCore.RenderInjectorMesh = RenderInjectorMesh;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Keeps a depot of objects that have been marked for reuse, sorted by type.
     * Using [[Recycler]] reduces load on the carbage collector and thus supports smooth performance
     */
    class Recycler {
        /**
         * Fetches an object of the requested type from the depot, or returns a new one, if the depot was empty
         * @param _T The class identifier of the desired object
         */
        static get(_T) {
            let key = _T.name;
            let instances = Recycler.depot[key];
            if (instances && instances.length > 0)
                return instances.pop();
            else
                return new _T();
        }
        /**
         * Returns a reference to an object of the requested type in the depot, but does not remove it there.
         * If no object of the requested type was in the depot, one is created, stored and borrowed.
         * For short term usage of objects in a local scope, when there will be no other call to Recycler.get or .borrow!
         * @param _T The class identifier of the desired object
         */
        static borrow(_T) {
            let t;
            let key = _T.name;
            let instances = Recycler.depot[key];
            if (!instances || instances.length == 0) {
                t = new _T();
                Recycler.store(t);
                return t;
            }
            return instances[0];
        }
        /**
         * Stores the object in the depot for later recycling. Users are responsible for throwing in objects that are about to loose scope and are not referenced by any other
         * @param _instance
         */
        static store(_instance) {
            let key = _instance.constructor.name;
            //Debug.log(key);
            let instances = Recycler.depot[key] || [];
            instances.push(_instance);
            Recycler.depot[key] = instances;
            // Debug.log(`ObjectManager.depot[${key}]: ${ObjectManager.depot[key].length}`);
            //Debug.log(this.depot);
        }
        /**
         * Emptys the depot of a given type, leaving the objects for the garbage collector. May result in a short stall when many objects were in
         * @param _T
         */
        static dump(_T) {
            let key = _T.name;
            Recycler.depot[key] = [];
        }
        /**
         * Emptys all depots, leaving all objects to the garbage collector. May result in a short stall when many objects were in
         */
        static dumpAll() {
            Recycler.depot = {};
        }
    }
    Recycler.depot = {};
    FudgeCore.Recycler = Recycler;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Stores and manipulates a twodimensional vector comprised of the components x and y
     * ```plaintext
     *            +y
     *             |__ +x
     * ```
     * @authors Lukas Scheuerle, Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Vector2 extends FudgeCore.Mutable {
        constructor(_x = 0, _y = 0) {
            super();
            this.data = new Float32Array([_x, _y]);
        }
        /**
         * A shorthand for writing `new Vector2(0, 0)`.
         * @returns A new vector with the values (0, 0)
         */
        static ZERO() {
            let vector = new Vector2();
            return vector;
        }
        /**
         * A shorthand for writing `new Vector2(_scale, _scale)`.
         * @param _scale the scale of the vector. Default: 1
         */
        static ONE(_scale = 1) {
            let vector = new Vector2(_scale, _scale);
            return vector;
        }
        /**
         * A shorthand for writing `new Vector2(0, y)`.
         * @param _scale The number to write in the y coordinate. Default: 1
         * @returns A new vector with the values (0, _scale)
         */
        static Y(_scale = 1) {
            let vector = new Vector2(0, _scale);
            return vector;
        }
        /**
         * A shorthand for writing `new Vector2(x, 0)`.
         * @param _scale The number to write in the x coordinate. Default: 1
         * @returns A new vector with the values (_scale, 0)
         */
        static X(_scale = 1) {
            let vector = new Vector2(_scale, 0);
            return vector;
        }
        static TRANSFORMATION(_vector, _matrix, _includeTranslation = true) {
            let result = new Vector2();
            let m = _matrix.get();
            let [x, y] = _vector.get();
            result.x = m[0] * x + m[3] * y;
            result.y = m[1] * x + m[4] * y;
            if (_includeTranslation) {
                result.add(_matrix.translation);
            }
            return result;
        }
        /**
         * Normalizes a given vector to the given length without editing the original vector.
         * @param _vector the vector to normalize
         * @param _length the length of the resulting vector. defaults to 1
         * @returns a new vector representing the normalised vector scaled by the given length
         */
        static NORMALIZATION(_vector, _length = 1) {
            let vector = Vector2.ZERO();
            try {
                let [x, y] = _vector.data;
                let factor = _length / Math.hypot(x, y);
                vector.data = new Float32Array([_vector.x * factor, _vector.y * factor]);
            }
            catch (_error) {
                FudgeCore.Debug.fudge(_error);
            }
            return vector;
        }
        /**
         * Scales a given vector by a given scale without changing the original vector
         * @param _vector The vector to scale.
         * @param _scale The scale to scale with.
         * @returns A new vector representing the scaled version of the given vector
         */
        static SCALE(_vector, _scale) {
            let vector = new Vector2(_vector.x * _scale, _vector.y * _scale);
            return vector;
        }
        /**
         * Sums up multiple vectors.
         * @param _vectors A series of vectors to sum up
         * @returns A new vector representing the sum of the given vectors
         */
        static SUM(..._vectors) {
            let result = new Vector2();
            for (let vector of _vectors)
                result.data = new Float32Array([result.x + vector.x, result.y + vector.y]);
            return result;
        }
        /**
         * Subtracts two vectors.
         * @param _a The vector to subtract from.
         * @param _b The vector to subtract.
         * @returns A new vector representing the difference of the given vectors
         */
        static DIFFERENCE(_a, _b) {
            let vector = new Vector2;
            vector.data = new Float32Array([_a.x - _b.x, _a.y - _b.y]);
            return vector;
        }
        /**
         * Computes the dotproduct of 2 vectors.
         * @param _a The vector to multiply.
         * @param _b The vector to multiply by.
         * @returns A new vector representing the dotproduct of the given vectors
         */
        static DOT(_a, _b) {
            let scalarProduct = _a.x * _b.x + _a.y * _b.y;
            return scalarProduct;
        }
        /**
         * Calculates the cross product of two Vectors. Due to them being only 2 Dimensional, the result is a single number,
         * which implicitly is on the Z axis. It is also the signed magnitude of the result.
         * @param _a Vector to compute the cross product on
         * @param _b Vector to compute the cross product with
         * @returns A number representing result of the cross product.
         */
        static CROSSPRODUCT(_a, _b) {
            let crossProduct = _a.x * _b.y - _a.y * _b.x;
            return crossProduct;
        }
        /**
         * Calculates the orthogonal vector to the given vector. Rotates counterclockwise by default.
         * ```plaintext
         * ↑ => ← => ↓ => → => ↑
         * ```
         * @param _vector Vector to get the orthogonal equivalent of
         * @param _clockwise Should the rotation be clockwise instead of the default counterclockwise? default: false
         * @returns A Vector that is orthogonal to and has the same magnitude as the given Vector.
         */
        static ORTHOGONAL(_vector, _clockwise = false) {
            if (_clockwise)
                return new Vector2(_vector.y, -_vector.x);
            else
                return new Vector2(-_vector.y, _vector.x);
        }
        get x() {
            return this.data[0];
        }
        get y() {
            return this.data[1];
        }
        set x(_x) {
            this.data[0] = _x;
        }
        set y(_y) {
            this.data[1] = _y;
        }
        /**
         * Returns the length of the vector
         */
        get magnitude() {
            return Math.hypot(...this.data);
        }
        /**
         * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
         */
        get magnitudeSquared() {
            return Vector2.DOT(this, this);
        }
        /**
         * @returns A deep copy of the vector.
         */
        get copy() {
            return new Vector2(this.x, this.y);
        }
        /**
         * Returns true if the coordinates of this and the given vector are to be considered identical within the given tolerance
         * TODO: examine, if tolerance as criterium for the difference is appropriate with very large coordinate values or if _tolerance should be multiplied by coordinate value
         */
        equals(_compare, _tolerance = Number.EPSILON) {
            if (Math.abs(this.x - _compare.x) > _tolerance)
                return false;
            if (Math.abs(this.y - _compare.y) > _tolerance)
                return false;
            return true;
        }
        /**
         * Adds the given vector to the executing vector, changing the executor.
         * @param _addend The vector to add.
         */
        add(_addend) {
            this.data = new Vector2(_addend.x + this.x, _addend.y + this.y).data;
        }
        /**
         * Subtracts the given vector from the executing vector, changing the executor.
         * @param _subtrahend The vector to subtract.
         */
        subtract(_subtrahend) {
            this.data = new Vector2(this.x - _subtrahend.x, this.y - _subtrahend.y).data;
        }
        /**
         * Scales the Vector by the _scale.
         * @param _scale The scale to multiply the vector with.
         */
        scale(_scale) {
            this.data = new Vector2(_scale * this.x, _scale * this.y).data;
        }
        /**
         * Normalizes the vector.
         * @param _length A modificator to get a different length of normalized vector.
         */
        normalize(_length = 1) {
            this.data = Vector2.NORMALIZATION(this, _length).data;
        }
        /**
         * Sets the Vector to the given parameters. Ommitted parameters default to 0.
         * @param _x new x to set
         * @param _y new y to set
         */
        set(_x = 0, _y = 0) {
            this.data = new Float32Array([_x, _y]);
        }
        /**
         * @returns An array of the data of the vector
         */
        get() {
            return new Float32Array(this.data);
        }
        transform(_matrix, _includeTranslation = true) {
            this.data = Vector2.TRANSFORMATION(this, _matrix, _includeTranslation).data;
        }
        /**
         * Adds a z-component of the given magnitude (default=0) to the vector and returns a new Vector3
         */
        toVector3(_z = 0) {
            return new FudgeCore.Vector3(this.x, this.y, _z);
        }
        toString() {
            let result = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)})`;
            return result;
        }
        //#region Transfer
        serialize() {
            let serialization = this.getMutator();
            // serialization.toJSON = () => { return `{ "r": ${this.r}, "g": ${this.g}, "b": ${this.b}, "a": ${this.a}}`; };
            serialization.toJSON = () => { return `[${this.x}, ${this.y}]`; };
            return serialization;
        }
        async deserialize(_serialization) {
            if (typeof (_serialization) == "string") {
                [this.x, this.y] = JSON.parse(_serialization);
            }
            else
                this.mutate(_serialization);
            return this;
        }
        getMutator() {
            let mutator = {
                x: this.data[0], y: this.data[1]
            };
            return mutator;
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.Vector2 = Vector2;
})(FudgeCore || (FudgeCore = {}));
///<reference path="../Engine/Recycler.ts"/>
///<reference path="Vector2.ts"/>
var FudgeCore;
///<reference path="../Engine/Recycler.ts"/>
///<reference path="Vector2.ts"/>
(function (FudgeCore) {
    /**
     * Defines the origin of a rectangle
     */
    let ORIGIN2D;
    (function (ORIGIN2D) {
        ORIGIN2D[ORIGIN2D["TOPLEFT"] = 0] = "TOPLEFT";
        ORIGIN2D[ORIGIN2D["TOPCENTER"] = 1] = "TOPCENTER";
        ORIGIN2D[ORIGIN2D["TOPRIGHT"] = 2] = "TOPRIGHT";
        ORIGIN2D[ORIGIN2D["CENTERLEFT"] = 16] = "CENTERLEFT";
        ORIGIN2D[ORIGIN2D["CENTER"] = 17] = "CENTER";
        ORIGIN2D[ORIGIN2D["CENTERRIGHT"] = 18] = "CENTERRIGHT";
        ORIGIN2D[ORIGIN2D["BOTTOMLEFT"] = 32] = "BOTTOMLEFT";
        ORIGIN2D[ORIGIN2D["BOTTOMCENTER"] = 33] = "BOTTOMCENTER";
        ORIGIN2D[ORIGIN2D["BOTTOMRIGHT"] = 34] = "BOTTOMRIGHT";
    })(ORIGIN2D = FudgeCore.ORIGIN2D || (FudgeCore.ORIGIN2D = {}));
    /**
     * Defines a rectangle with position and size and add comfortable methods to it
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Rectangle extends FudgeCore.Mutable {
        constructor(_x = 0, _y = 0, _width = 1, _height = 1, _origin = ORIGIN2D.TOPLEFT) {
            super();
            this.position = FudgeCore.Recycler.get(FudgeCore.Vector2);
            this.size = FudgeCore.Recycler.get(FudgeCore.Vector2);
            this.setPositionAndSize(_x, _y, _width, _height, _origin);
        }
        /**
         * Returns a new rectangle created with the given parameters
         */
        static GET(_x = 0, _y = 0, _width = 1, _height = 1, _origin = ORIGIN2D.TOPLEFT) {
            let rect = FudgeCore.Recycler.get(Rectangle);
            rect.setPositionAndSize(_x, _y, _width, _height);
            return rect;
        }
        /**
         * Sets the position and size of the rectangle according to the given parameters
         */
        setPositionAndSize(_x = 0, _y = 0, _width = 1, _height = 1, _origin = ORIGIN2D.TOPLEFT) {
            this.size.set(_width, _height);
            switch (_origin & 0x03) {
                case 0x00:
                    this.position.x = _x;
                    break;
                case 0x01:
                    this.position.x = _x - _width / 2;
                    break;
                case 0x02:
                    this.position.x = _x - _width;
                    break;
            }
            switch (_origin & 0x30) {
                case 0x00:
                    this.position.y = _y;
                    break;
                case 0x10:
                    this.position.y = _y - _height / 2;
                    break;
                case 0x20:
                    this.position.y = _y - _height;
                    break;
            }
        }
        pointToRect(_point, _target) {
            let result = _point.copy;
            result.subtract(this.position);
            result.x *= _target.width / this.width;
            result.y *= _target.height / this.height;
            result.add(_target.position);
            return result;
        }
        get x() {
            return this.position.x;
        }
        get y() {
            return this.position.y;
        }
        get width() {
            return this.size.x;
        }
        get height() {
            return this.size.y;
        }
        /**
         * Return the leftmost expansion, respecting also negative values of width
         */
        get left() {
            if (this.size.x > 0)
                return this.position.x;
            return (this.position.x + this.size.x);
        }
        /**
         * Return the topmost expansion, respecting also negative values of height
         */
        get top() {
            if (this.size.y > 0)
                return this.position.y;
            return (this.position.y + this.size.y);
        }
        /**
         * Return the rightmost expansion, respecting also negative values of width
         */
        get right() {
            if (this.size.x > 0)
                return (this.position.x + this.size.x);
            return this.position.x;
        }
        /**
         * Return the lowest expansion, respecting also negative values of height
         */
        get bottom() {
            if (this.size.y > 0)
                return (this.position.y + this.size.y);
            return this.position.y;
        }
        set x(_x) {
            this.position.x = _x;
        }
        set y(_y) {
            this.position.y = _y;
        }
        set width(_width) {
            this.size.x = _width;
        }
        set height(_height) {
            this.size.y = _height;
        }
        set left(_value) {
            this.size.x = this.right - _value;
            this.position.x = _value;
        }
        set top(_value) {
            this.size.y = this.bottom - _value;
            this.position.y = _value;
        }
        set right(_value) {
            this.size.x = this.position.x + _value;
        }
        set bottom(_value) {
            this.size.y = this.position.y + _value;
        }
        get copy() {
            return Rectangle.GET(this.x, this.y, this.width, this.height);
        }
        /**
         * Returns true if the given point is inside of this rectangle or on the border
         * @param _point
         */
        isInside(_point) {
            return (_point.x >= this.left && _point.x <= this.right && _point.y >= this.top && _point.y <= this.bottom);
        }
        /**
         * Returns true if this rectangle collides with the rectangle given
         * @param _rect
         */
        collides(_rect) {
            if (this.left > _rect.right)
                return false;
            if (this.right < _rect.left)
                return false;
            if (this.top > _rect.bottom)
                return false;
            if (this.bottom < _rect.top)
                return false;
            return true;
        }
        /**
         * Returns the rectangle created by the intersection of this and the given rectangle or null, if they don't collide
         */
        getIntersection(_rect) {
            if (!this.collides(_rect))
                return null;
            let intersection = new Rectangle();
            intersection.x = Math.max(this.left, _rect.left);
            intersection.y = Math.max(this.top, _rect.top);
            intersection.width = Math.min(this.right, _rect.right) - intersection.x;
            intersection.height = Math.min(this.bottom, _rect.bottom) - intersection.y;
            return intersection;
        }
        /**
         * Creates a string representation of this rectangle
         */
        toString() {
            let result = `ƒ.Rectangle(position:${this.position.toString()}, size:${this.size.toString()}`;
            result += `, left:${this.left.toPrecision(5)}, top:${this.top.toPrecision(5)}, right:${this.right.toPrecision(5)}, bottom:${this.bottom.toPrecision(5)}`;
            return result;
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.Rectangle = Rectangle;
})(FudgeCore || (FudgeCore = {}));
///<reference path="RenderInjector.ts"/>
///<reference path="RenderInjectorShader.ts"/>
///<reference path="RenderInjectorCoat.ts"/>
///<reference path="RenderInjectorMesh.ts"/>
///<reference path="../Math/Rectangle.ts"/>
var FudgeCore;
///<reference path="RenderInjector.ts"/>
///<reference path="RenderInjectorShader.ts"/>
///<reference path="RenderInjectorCoat.ts"/>
///<reference path="RenderInjectorMesh.ts"/>
///<reference path="../Math/Rectangle.ts"/>
(function (FudgeCore) {
    let BLEND;
    (function (BLEND) {
        BLEND[BLEND["OPAQUE"] = 0] = "OPAQUE";
        BLEND[BLEND["TRANSPARENT"] = 1] = "TRANSPARENT";
        BLEND[BLEND["PARTICLE"] = 2] = "PARTICLE";
    })(BLEND = FudgeCore.BLEND || (FudgeCore.BLEND = {}));
    /**
     * Base class for RenderManager, handling the connection to the rendering system, in this case WebGL.
     * Methods and attributes of this class should not be called directly, only through [[RenderManager]]
     */
    class RenderOperator {
        /**
         * Wrapper function to utilize the bufferSpecification interface when passing data to the shader via a buffer.
         * @param _attributeLocation  The location of the attribute on the shader, to which they data will be passed.
         * @param _bufferSpecification  Interface passing datapullspecifications to the buffer.
         */
        static setAttributeStructure(_attributeLocation, _bufferSpecification) {
            RenderOperator.crc3.vertexAttribPointer(_attributeLocation, _bufferSpecification.size, _bufferSpecification.dataType, _bufferSpecification.normalize, _bufferSpecification.stride, _bufferSpecification.offset);
        }
        /**
        * Checks the first parameter and throws an exception with the WebGL-errorcode if the value is null
        * @param _value  value to check against null
        * @param _message  optional, additional message for the exception
        */
        static assert(_value, _message = "") {
            if (_value === null)
                throw new Error(`Assertion failed. ${_message}, WebGL-Error: ${RenderOperator.crc3 ? RenderOperator.crc3.getError() : ""}`);
            return _value;
        }
        /**
         * Initializes offscreen-canvas, renderingcontext and hardware viewport. Call once before creating any resources like meshes or shaders
         */
        static initialize(_antialias, _alpha) {
            FudgeCore.fudgeConfig = FudgeCore.fudgeConfig || {};
            let contextAttributes = {
                alpha: (_alpha != undefined) ? _alpha : FudgeCore.fudgeConfig.alpha || false,
                antialias: (_antialias != undefined) ? _antialias : FudgeCore.fudgeConfig.antialias || false,
                premultipliedAlpha: false
            };
            FudgeCore.Debug.fudge("Initialize RenderManager", contextAttributes);
            let canvas = document.createElement("canvas");
            let crc3;
            crc3 = RenderOperator.assert(canvas.getContext("webgl2", contextAttributes), "WebGL-context couldn't be created");
            RenderOperator.crc3 = crc3;
            // Enable backface- and zBuffer-culling.
            crc3.enable(WebGL2RenderingContext.CULL_FACE);
            crc3.enable(WebGL2RenderingContext.DEPTH_TEST);
            crc3.enable(WebGL2RenderingContext.BLEND);
            crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
            RenderOperator.setBlendMode(BLEND.TRANSPARENT);
            // RenderOperator.crc3.pixelStorei(WebGL2RenderingContext.UNPACK_FLIP_Y_WEBGL, true);
            RenderOperator.rectViewport = RenderOperator.getCanvasRect();
            return crc3;
        }
        /**
         * Return a reference to the offscreen-canvas
         */
        static getCanvas() {
            return RenderOperator.crc3.canvas; // TODO: enable OffscreenCanvas
        }
        /**
         * Return a reference to the rendering context
         */
        static getRenderingContext() {
            return RenderOperator.crc3;
        }
        /**
         * Return a rectangle describing the size of the offscreen-canvas. x,y are 0 at all times.
         */
        static getCanvasRect() {
            let canvas = RenderOperator.crc3.canvas;
            return FudgeCore.Rectangle.GET(0, 0, canvas.width, canvas.height);
        }
        /**
         * Set the size of the offscreen-canvas.
         */
        static setCanvasSize(_width, _height) {
            RenderOperator.crc3.canvas.width = _width;
            RenderOperator.crc3.canvas.height = _height;
        }
        /**
         * Set the area on the offscreen-canvas to render the camera image to.
         * @param _rect
         */
        static setViewportRectangle(_rect) {
            Object.assign(RenderOperator.rectViewport, _rect);
            RenderOperator.crc3.viewport(_rect.x, _rect.y, _rect.width, _rect.height);
        }
        /**
         * Retrieve the area on the offscreen-canvas the camera image gets rendered to.
         */
        static getViewportRectangle() {
            return RenderOperator.rectViewport;
        }
        static setDepthTest(_test) {
            if (_test)
                RenderOperator.crc3.enable(WebGL2RenderingContext.DEPTH_TEST);
            else
                RenderOperator.crc3.disable(WebGL2RenderingContext.DEPTH_TEST);
        }
        static setBlendMode(_mode) {
            switch (_mode) {
                case BLEND.OPAQUE:
                    RenderOperator.crc3.blendFunc(WebGL2RenderingContext.ONE, WebGL2RenderingContext.ZERO);
                    break;
                case BLEND.TRANSPARENT:
                    RenderOperator.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
                    break;
                case BLEND.PARTICLE:
                    RenderOperator.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.DST_ALPHA);
                    break;
                default:
                    break;
            }
        }
        /**
         * Draw a mesh buffer using the given infos and the complete projection matrix
         */
        static draw(_mesh, cmpMaterial, _final, _projection) {
            let shader = cmpMaterial.material.getShader();
            let coat = cmpMaterial.material.getCoat();
            shader.useProgram();
            _mesh.useRenderBuffers(shader, _final, _projection);
            coat.useRenderData(shader, cmpMaterial);
            RenderOperator.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, _mesh.renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
        }
    }
    RenderOperator.crc3 = RenderOperator.initialize();
    RenderOperator.rectViewport = RenderOperator.getCanvasRect();
    FudgeCore.RenderOperator = RenderOperator;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorTexture extends FudgeCore.RenderInjector {
        static decorate(_constructor) {
            FudgeCore.RenderInjector.inject(_constructor, RenderInjectorTexture);
        }
        static injectTextureImage() {
            let crc3 = FudgeCore.RenderOperator.getRenderingContext();
            if (this.renderData) {
                // buffers exist
                crc3.activeTexture(WebGL2RenderingContext.TEXTURE0);
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.renderData["texture0"]);
            }
            else {
                this.renderData = {};
                // TODO: check if all WebGL-Creations are asserted
                const texture = FudgeCore.RenderManager.assert(crc3.createTexture());
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, texture);
                try {
                    crc3.texImage2D(crc3.TEXTURE_2D, 0, crc3.RGBA, crc3.RGBA, crc3.UNSIGNED_BYTE, this.image);
                    crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, this.image);
                }
                catch (_error) {
                    FudgeCore.Debug.error(_error);
                }
                crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.NEAREST);
                crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.NEAREST);
                // crc3.generateMipmap(crc3.TEXTURE_2D);
                this.renderData["texture0"] = texture;
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
                this.useRenderData();
            }
        }
    }
    FudgeCore.RenderInjectorTexture = RenderInjectorTexture;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Represents a node in the scenetree.
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/JirkaDellOro/FUDGE/wiki/Graph
     */
    class Node extends FudgeCore.EventTargetƒ {
        /**
         * Creates a new node with a name and initializes all attributes
         * @param _name The name by which the node can be called.
         */
        constructor(_name) {
            super();
            this.mtxWorld = FudgeCore.Matrix4x4.IDENTITY();
            this.timestampUpdate = 0;
            this.parent = null; // The parent of this node.
            this.children = []; // array of child nodes appended to this node.
            this.components = {};
            // private tags: string[] = []; // Names of tags that are attached to this node. (TODO: As of yet no functionality)
            // private layers: string[] = []; // Names of the layers this node is on. (TODO: As of yet no functionality)
            this.listeners = {};
            this.captures = {};
            this.active = true;
            /**
             * Simply calls [[addChild]]. This reference is here solely because appendChild is the equivalent method in DOM.
             * See and preferably use [[addChild]]
             */
            // tslint:disable-next-line: member-ordering
            this.appendChild = this.addChild;
            this.name = _name;
        }
        get isActive() {
            return this.active;
        }
        /**
         * Shortcut to retrieve this nodes [[ComponentTransform]]
         */
        get cmpTransform() {
            return this.getComponents(FudgeCore.ComponentTransform)[0];
        }
        /**
         * Shortcut to retrieve the local [[Matrix4x4]] attached to this nodes [[ComponentTransform]]
         * Fails if no [[ComponentTransform]] is attached
         */
        get mtxLocal() {
            return this.cmpTransform.local;
        }
        get mtxWorldInverse() {
            if (this.worldInverseUpdated != this.timestampUpdate)
                this.worldInverse = FudgeCore.Matrix4x4.INVERSION(this.mtxWorld);
            this.worldInverseUpdated = this.timestampUpdate;
            return this.worldInverse;
        }
        /**
         * Returns the number of children attached to this
         */
        get nChildren() {
            return this.children.length;
        }
        /**
         * Generator yielding the node and all decendants in the graph below for iteration
         */
        get graph() {
            return this.getGraphGenerator();
        }
        activate(_on) {
            this.active = _on;
            // TODO: check if COMPONENT_ACTIVATE/DEACTIVATE is the correct event to dispatch. Shouldn't it be something like NODE_ACTIVATE/DEACTIVATE?
            this.dispatchEvent(new Event(_on ? "componentActivate" /* COMPONENT_ACTIVATE */ : "componentDeactivate" /* COMPONENT_DEACTIVATE */));
        }
        // #region Scenetree
        /**
         * Returns a reference to this nodes parent node
         */
        getParent() {
            return this.parent;
        }
        /**
         * Traces back the ancestors of this node and returns the first
         */
        getAncestor() {
            let ancestor = this;
            while (ancestor.getParent())
                ancestor = ancestor.getParent();
            return ancestor;
        }
        /**
         * Returns child at the given index in the list of children
         */
        getChild(_index) {
            return this.children[_index];
        }
        /**
         * Returns a clone of the list of children
         */
        getChildren() {
            return this.children.slice(0);
        }
        /**
         * Returns an array of references to childnodes with the supplied name.
         */
        getChildrenByName(_name) {
            let found = [];
            found = this.children.filter((_node) => _node.name == _name);
            return found;
        }
        /**
         * Adds the given reference to a node to the list of children, if not already in
         * @throws Error when trying to add an ancestor of this
         */
        addChild(_child) {
            if (this.children.includes(_child))
                // _node is already a child of this
                return;
            let inAudioGraph = false;
            let graphListened = FudgeCore.AudioManager.default.getGraphListeningTo();
            let ancestor = this;
            while (ancestor) {
                ancestor.timestampUpdate = 0;
                inAudioGraph = inAudioGraph || (ancestor == graphListened);
                if (ancestor == _child)
                    throw (new Error("Cyclic reference prohibited in node hierarchy, ancestors must not be added as children"));
                else
                    ancestor = ancestor.parent;
            }
            let previousParent = _child.parent;
            if (previousParent)
                previousParent.removeChild(_child);
            this.children.push(_child);
            _child.parent = this;
            _child.dispatchEvent(new Event("childAppend" /* CHILD_APPEND */, { bubbles: true }));
            if (inAudioGraph)
                _child.broadcastEvent(new Event("childAppendToAudioGraph" /* CHILD_APPEND */));
        }
        /**
         * Removes the reference to the give node from the list of children
         * @param _child The node to be removed.
         */
        removeChild(_child) {
            let found = this.findChild(_child);
            if (found < 0)
                return;
            _child.dispatchEvent(new Event("childRemove" /* CHILD_REMOVE */, { bubbles: true }));
            if (this.isDescendantOf(FudgeCore.AudioManager.default.getGraphListeningTo()))
                _child.broadcastEvent(new Event("childRemoveFromAudioGraph" /* CHILD_REMOVE */));
            this.children.splice(found, 1);
            _child.parent = null;
        }
        /**
         * Removes all references in the list of children
         */
        removeAllChildren() {
            while (this.children.length)
                this.removeChild(this.children[0]);
        }
        /**
         * Returns the position of the node in the list of children or -1 if not found
         * @param _search The node to be found.
         */
        findChild(_search) {
            return this.children.indexOf(_search);
        }
        /**
         * Replaces a child node with another, preserving the position in the list of children
         * @param _replace The node to be replaced
         * @param _with The node to replace with
         */
        replaceChild(_replace, _with) {
            let found = this.findChild(_replace);
            if (found < 0)
                return false;
            let previousParent = _with.getParent();
            if (previousParent)
                previousParent.removeChild(_with);
            _replace.parent = null;
            this.children[found] = _with;
            _with.parent = this;
            _with.dispatchEvent(new Event("childAppend" /* CHILD_APPEND */, { bubbles: true }));
            if (this.isDescendantOf(FudgeCore.AudioManager.default.getGraphListeningTo()))
                _with.broadcastEvent(new Event("childAppendToAudioGraph" /* CHILD_APPEND */));
            return true;
        }
        isUpdated(_timestampUpdate) {
            return (this.timestampUpdate == _timestampUpdate);
        }
        isDescendantOf(_ancestor) {
            let node = this;
            while (node && node != _ancestor)
                node = node.parent;
            return (node != null);
        }
        /**
         * Applies a Mutator from [[Animation]] to all its components and transfers it to its children.
         * @param _mutator The mutator generated from an [[Animation]]
         */
        applyAnimation(_mutator) {
            if (_mutator.components) {
                for (let componentName in _mutator.components) {
                    if (this.components[componentName]) {
                        let mutatorOfComponent = _mutator.components;
                        for (let i in mutatorOfComponent[componentName]) {
                            if (this.components[componentName][+i]) {
                                let componentToMutate = this.components[componentName][+i];
                                let mutatorArray = mutatorOfComponent[componentName];
                                let mutatorWithComponentName = mutatorArray[+i];
                                for (let cname in mutatorWithComponentName) { // trick used to get the only entry in the list
                                    let mutatorToGive = mutatorWithComponentName[cname];
                                    componentToMutate.mutate(mutatorToGive);
                                }
                            }
                        }
                    }
                }
            }
            if (_mutator.children) {
                for (let i = 0; i < _mutator.children.length; i++) {
                    let name = _mutator.children[i]["ƒ.Node"].name;
                    let childNodes = this.getChildrenByName(name);
                    for (let childNode of childNodes) {
                        childNode.applyAnimation(_mutator.children[i]["ƒ.Node"]);
                    }
                }
            }
        }
        // #endregion
        // #region Components
        /**
         * Returns a list of all components attached to this node, independent of type.
         */
        getAllComponents() {
            let all = [];
            for (let type in this.components) {
                all = all.concat(this.components[type]);
            }
            return all;
        }
        /**
         * Returns a clone of the list of components of the given class attached to this node.
         * @param _class The class of the components to be found.
         */
        getComponents(_class) {
            return (this.components[_class.name] || []).slice(0);
        }
        /**
         * Returns the first compontent found of the given class attached this node or null, if list is empty or doesn't exist
         * @param _class The class of the components to be found.
         */
        getComponent(_class) {
            let list = this.components[_class.name];
            if (list)
                return list[0];
            return null;
        }
        /**
         * Adds the supplied component into the nodes component map.
         * @param _component The component to be pushed into the array.
         */
        addComponent(_component) {
            if (_component.getContainer() == this)
                return;
            let cmpList = this.components[_component.type];
            if (cmpList === undefined)
                this.components[_component.type] = [_component];
            else if (cmpList.length && _component.isSingleton)
                throw new Error("Component is marked singleton and can't be attached, no more than one allowed");
            else
                cmpList.push(_component);
            _component.setContainer(this);
            _component.dispatchEvent(new Event("componentAdd" /* COMPONENT_ADD */));
        }
        /**
         * Removes the given component from the node, if it was attached, and sets its parent to null.
         * @param _component The component to be removed
         * @throws Exception when component is not found
         */
        removeComponent(_component) {
            try {
                let componentsOfType = this.components[_component.type];
                let foundAt = componentsOfType.indexOf(_component);
                if (foundAt < 0)
                    return;
                _component.dispatchEvent(new Event("componentRemove" /* COMPONENT_REMOVE */));
                componentsOfType.splice(foundAt, 1);
                _component.setContainer(null);
            }
            catch (_error) {
                throw new Error(`Unable to remove component '${_component}'in node named '${this.name}'`);
            }
        }
        // #endregion
        // #region Serialization
        serialize() {
            let serialization = {
                name: this.name
            };
            let components = {};
            for (let type in this.components) {
                components[type] = [];
                for (let component of this.components[type]) {
                    // components[type].push(component.serialize());
                    components[type].push(FudgeCore.Serializer.serialize(component));
                }
            }
            serialization["components"] = components;
            let children = [];
            for (let child of this.children) {
                children.push(FudgeCore.Serializer.serialize(child));
            }
            serialization["children"] = children;
            this.dispatchEvent(new Event("nodeSerialized" /* NODE_SERIALIZED */));
            return serialization;
        }
        async deserialize(_serialization) {
            this.name = _serialization.name;
            // this.parent = is set when the nodes are added
            // deserialize components first so scripts can react to children being appended
            for (let type in _serialization.components) {
                for (let serializedComponent of _serialization.components[type]) {
                    let deserializedComponent = await FudgeCore.Serializer.deserialize(serializedComponent);
                    this.addComponent(deserializedComponent);
                }
            }
            for (let serializedChild of _serialization.children) {
                let deserializedChild = await FudgeCore.Serializer.deserialize(serializedChild);
                this.appendChild(deserializedChild);
            }
            this.dispatchEvent(new Event("nodeDeserialized" /* NODE_DESERIALIZED */));
            return this;
        }
        // #endregion
        /**
         * Creates a string as representation of this node and its descendants
         */
        toHierarchyString(_node = null, _level = 0) {
            // TODO: refactor for better readability
            if (!_node)
                _node = this;
            let prefix = "+".repeat(_level);
            let output = prefix + " " + _node.name + " | ";
            for (let type in _node.components)
                output += _node.components[type].length + " " + type.split("Component").pop() + ", ";
            output = output.slice(0, -2) + "</br>";
            for (let child of _node.children) {
                output += this.toHierarchyString(child, _level + 1);
            }
            return output;
        }
        // #region Events
        /**
         * Adds an event listener to the node. The given handler will be called when a matching event is passed to the node.
         * Deviating from the standard EventTarget, here the _handler must be a function and _capture is the only option.
         * @param _type The type of the event, should be an enumerated value of NODE_EVENT, can be any string
         * @param _handler The function to call when the event reaches this node
         * @param _capture When true, the listener listens in the capture phase, when the event travels deeper into the hierarchy of nodes.
         */
        addEventListener(_type, _handler, _capture = false) {
            let listListeners = _capture ? this.captures : this.listeners;
            if (!listListeners[_type])
                listListeners[_type] = [];
            listListeners[_type].push(_handler);
        }
        /**
         * Removes an event listener from the node. The signatur must match the one used with addEventListener
         * @param _type The type of the event, should be an enumerated value of NODE_EVENT, can be any string
         * @param _handler The function to call when the event reaches this node
         * @param _capture When true, the listener listens in the capture phase, when the event travels deeper into the hierarchy of nodes.
         */
        removeEventListener(_type, _handler, _capture = false) {
            let listenersForType = _capture ? this.captures[_type] : this.listeners[_type];
            if (listenersForType)
                for (let i = listenersForType.length - 1; i >= 0; i--)
                    if (listenersForType[i] == _handler)
                        listenersForType.splice(i, 1);
        }
        /**
         * Dispatches a synthetic event to target. This implementation always returns true (standard: return true only if either event's cancelable attribute value is false or its preventDefault() method was not invoked)
         * The event travels into the hierarchy to this node dispatching the event, invoking matching handlers of the nodes ancestors listening to the capture phase,
         * than the matching handler of the target node in the target phase, and back out of the hierarchy in the bubbling phase, invoking appropriate handlers of the anvestors
         * @param _event The event to dispatch
         */
        dispatchEvent(_event) {
            let ancestors = [];
            let upcoming = this;
            // overwrite event target
            Object.defineProperty(_event, "target", { writable: true, value: this });
            // TODO: consider using Reflect instead of Object throughout. See also Render and Mutable...
            while (upcoming.parent)
                ancestors.push(upcoming = upcoming.parent);
            // capture phase
            Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.CAPTURING_PHASE });
            for (let i = ancestors.length - 1; i >= 0; i--) {
                let ancestor = ancestors[i];
                Object.defineProperty(_event, "currentTarget", { writable: true, value: ancestor });
                let captures = ancestor.captures[_event.type] || [];
                for (let handler of captures)
                    handler(_event);
            }
            if (!_event.bubbles)
                return true;
            // target phase
            Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.AT_TARGET });
            Object.defineProperty(_event, "currentTarget", { writable: true, value: this });
            let listeners = this.listeners[_event.type] || [];
            for (let handler of listeners)
                handler(_event);
            // bubble phase
            Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.BUBBLING_PHASE });
            for (let i = 0; i < ancestors.length; i++) {
                let ancestor = ancestors[i];
                Object.defineProperty(_event, "currentTarget", { writable: true, value: ancestor });
                let listeners = ancestor.listeners[_event.type] || [];
                for (let handler of listeners)
                    handler(_event);
            }
            return true; //TODO: return a meaningful value, see documentation of dispatch event
        }
        /**
         * Broadcasts a synthetic event to this node and from there to all nodes deeper in the hierarchy,
         * invoking matching handlers of the nodes listening to the capture phase. Watch performance when there are many nodes involved
         * @param _event The event to broadcast
         */
        broadcastEvent(_event) {
            // overwrite event target and phase
            Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.CAPTURING_PHASE });
            Object.defineProperty(_event, "target", { writable: true, value: this });
            this.broadcastEventRecursive(_event);
        }
        broadcastEventRecursive(_event) {
            // capture phase only
            Object.defineProperty(_event, "currentTarget", { writable: true, value: this });
            let captures = this.captures[_event.type] || [];
            for (let handler of captures)
                handler(_event);
            // appears to be slower, astonishingly...
            // captures.forEach(function (handler: Function): void {
            //     handler(_event);
            // });
            // same for children
            for (let child of this.children) {
                child.broadcastEventRecursive(_event);
            }
        }
        // #endregion
        *getGraphGenerator() {
            yield this;
            for (let child of this.children)
                yield* child.graph;
        }
    }
    FudgeCore.Node = Node;
})(FudgeCore || (FudgeCore = {}));
/// <reference path="Debug/DebugTarget.ts"/>
/// <reference path="Debug/Debug.ts"/>
/// <reference path="Event/Event.ts"/>
/// <reference path="Transfer/Mutable.ts"/>  
/// <reference path="Transfer/Serializer.ts"/> 
/// <reference path="Render/RenderOperator.ts"/>
/// <reference path="Render/RenderInjectorTexture.ts"/>
/// <reference path="Graph/Node.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
var FudgeCore;
// / <reference path="../Transfer/Mutable.ts"/>
(function (FudgeCore) {
    /**
     * Internally used to differentiate between the various generated structures and events.
     * @author Lukas Scheuerle, HFU, 2019
     */
    let ANIMATION_STRUCTURE_TYPE;
    (function (ANIMATION_STRUCTURE_TYPE) {
        /**Default: forward, continous */
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["NORMAL"] = 0] = "NORMAL";
        /**backward, continous */
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["REVERSE"] = 1] = "REVERSE";
        /**forward, rastered */
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["RASTERED"] = 2] = "RASTERED";
        /**backward, rastered */
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["RASTEREDREVERSE"] = 3] = "RASTEREDREVERSE";
    })(ANIMATION_STRUCTURE_TYPE || (ANIMATION_STRUCTURE_TYPE = {}));
    /**
     * Animation Class to hold all required Objects that are part of an Animation.
     * Also holds functions to play said Animation.
     * Can be added to a Node and played through [[ComponentAnimator]].
     * @author Lukas Scheuerle, HFU, 2019
     */
    class Animation extends FudgeCore.Mutable {
        constructor(_name, _animStructure = {}, _fps = 60) {
            super();
            this.totalTime = 0;
            this.labels = {};
            this.stepsPerSecond = 10;
            this.events = {};
            this.framesPerSecond = 60;
            // processed eventlist and animation strucutres for playback.
            this.eventsProcessed = new Map();
            this.animationStructuresProcessed = new Map();
            this.name = _name;
            this.animationStructure = _animStructure;
            this.animationStructuresProcessed.set(ANIMATION_STRUCTURE_TYPE.NORMAL, _animStructure);
            this.framesPerSecond = _fps;
            this.calculateTotalTime();
        }
        get getLabels() {
            //TODO: this actually needs testing
            let en = new Enumerator(this.labels);
            return en;
        }
        get fps() {
            return this.framesPerSecond;
        }
        set fps(_fps) {
            this.framesPerSecond = _fps;
            this.eventsProcessed.clear();
            this.animationStructuresProcessed.clear();
        }
        /**
         * Generates a new "Mutator" with the information to apply to the [[Node]] the [[ComponentAnimator]] is attached to with [[Node.applyAnimation()]].
         * @param _time The time at which the animation currently is at
         * @param _direction The direction in which the animation is supposed to be playing back. >0 == forward, 0 == stop, <0 == backwards
         * @param _playback The playbackmode the animation is supposed to be calculated with.
         * @returns a "Mutator" to apply.
         */
        getMutated(_time, _direction, _playback) {
            let m = {};
            if (_playback == FudgeCore.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS) {
                if (_direction >= 0) {
                    m = this.traverseStructureForMutator(this.getProcessedAnimationStructure(ANIMATION_STRUCTURE_TYPE.NORMAL), _time);
                }
                else {
                    m = this.traverseStructureForMutator(this.getProcessedAnimationStructure(ANIMATION_STRUCTURE_TYPE.REVERSE), _time);
                }
            }
            else {
                if (_direction >= 0) {
                    m = this.traverseStructureForMutator(this.getProcessedAnimationStructure(ANIMATION_STRUCTURE_TYPE.RASTERED), _time);
                }
                else {
                    m = this.traverseStructureForMutator(this.getProcessedAnimationStructure(ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE), _time);
                }
            }
            return m;
        }
        /**
         * Returns a list of the names of the events the [[ComponentAnimator]] needs to fire between _min and _max.
         * @param _min The minimum time (inclusive) to check between
         * @param _max The maximum time (exclusive) to check between
         * @param _playback The playback mode to check in. Has an effect on when the Events are fired.
         * @param _direction The direction the animation is supposed to run in. >0 == forward, 0 == stop, <0 == backwards
         * @returns a list of strings with the names of the custom events to fire.
         */
        getEventsToFire(_min, _max, _playback, _direction) {
            let eventList = [];
            let minSection = Math.floor(_min / this.totalTime);
            let maxSection = Math.floor(_max / this.totalTime);
            _min = _min % this.totalTime;
            _max = _max % this.totalTime;
            while (minSection <= maxSection) {
                let eventTriggers = this.getCorrectEventList(_direction, _playback);
                if (minSection == maxSection) {
                    eventList = eventList.concat(this.checkEventsBetween(eventTriggers, _min, _max));
                }
                else {
                    eventList = eventList.concat(this.checkEventsBetween(eventTriggers, _min, this.totalTime));
                    _min = 0;
                }
                minSection++;
            }
            return eventList;
        }
        /**
         * Adds an Event to the List of events.
         * @param _name The name of the event (needs to be unique per Animation).
         * @param _time The timestamp of the event (in milliseconds).
         */
        setEvent(_name, _time) {
            this.events[_name] = _time;
            this.eventsProcessed.clear();
        }
        /**
         * Removes the event with the given name from the list of events.
         * @param _name name of the event to remove.
         */
        removeEvent(_name) {
            delete this.events[_name];
            this.eventsProcessed.clear();
        }
        /**
         * (Re-)Calculate the total time of the Animation. Calculation-heavy, use only if actually needed.
         */
        calculateTotalTime() {
            this.totalTime = 0;
            this.traverseStructureForTime(this.animationStructure);
        }
        //#region transfer
        serialize() {
            let s = {
                idResource: this.idResource,
                name: this.name,
                labels: {},
                events: {},
                fps: this.framesPerSecond,
                sps: this.stepsPerSecond
            };
            for (let name in this.labels) {
                s.labels[name] = this.labels[name];
            }
            for (let name in this.events) {
                s.events[name] = this.events[name];
            }
            s.animationStructure = this.traverseStructureForSerialisation(this.animationStructure);
            return s;
        }
        async deserialize(_serialization) {
            this.idResource = _serialization.idResource;
            this.name = _serialization.name;
            this.framesPerSecond = _serialization.fps;
            this.stepsPerSecond = _serialization.sps;
            this.labels = {};
            for (let name in _serialization.labels) {
                this.labels[name] = _serialization.labels[name];
            }
            this.events = {};
            for (let name in _serialization.events) {
                this.events[name] = _serialization.events[name];
            }
            this.eventsProcessed = new Map();
            this.animationStructure = this.traverseStructureForDeserialisation(_serialization.animationStructure);
            this.animationStructuresProcessed = new Map();
            this.calculateTotalTime();
            return this;
        }
        getMutator() {
            return this.serialize();
        }
        reduceMutator(_mutator) {
            delete _mutator.totalTime;
        }
        /**
         * Traverses an AnimationStructure and returns the Serialization of said Structure.
         * @param _structure The Animation Structure at the current level to transform into the Serialization.
         * @returns the filled Serialization.
         */
        traverseStructureForSerialisation(_structure) {
            let newSerialization = {};
            for (let n in _structure) {
                if (_structure[n] instanceof FudgeCore.AnimationSequence) {
                    newSerialization[n] = _structure[n].serialize();
                }
                else {
                    newSerialization[n] = this.traverseStructureForSerialisation(_structure[n]);
                }
            }
            return newSerialization;
        }
        /**
         * Traverses a Serialization to create a new AnimationStructure.
         * @param _serialization The serialization to transfer into an AnimationStructure
         * @returns the newly created AnimationStructure.
         */
        traverseStructureForDeserialisation(_serialization) {
            let newStructure = {};
            for (let n in _serialization) {
                if (_serialization[n].animationSequence) {
                    let animSeq = new FudgeCore.AnimationSequence();
                    newStructure[n] = animSeq.deserialize(_serialization[n]);
                }
                else {
                    newStructure[n] = this.traverseStructureForDeserialisation(_serialization[n]);
                }
            }
            return newStructure;
        }
        //#endregion
        /**
         * Finds the list of events to be used with these settings.
         * @param _direction The direction the animation is playing in.
         * @param _playback The playbackmode the animation is playing in.
         * @returns The correct AnimationEventTrigger Object to use
         */
        getCorrectEventList(_direction, _playback) {
            if (_playback != FudgeCore.ANIMATION_PLAYBACK.FRAMEBASED) {
                if (_direction >= 0) {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.NORMAL);
                }
                else {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.REVERSE);
                }
            }
            else {
                if (_direction >= 0) {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.RASTERED);
                }
                else {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE);
                }
            }
        }
        /**
         * Traverses an AnimationStructure to turn it into the "Mutator" to return to the Component.
         * @param _structure The strcuture to traverse
         * @param _time the point in time to write the animation numbers into.
         * @returns The "Mutator" filled with the correct values at the given time.
         */
        traverseStructureForMutator(_structure, _time) {
            let newMutator = {};
            for (let n in _structure) {
                if (_structure[n] instanceof FudgeCore.AnimationSequence) {
                    newMutator[n] = _structure[n].evaluate(_time);
                }
                else {
                    newMutator[n] = this.traverseStructureForMutator(_structure[n], _time);
                }
            }
            return newMutator;
        }
        /**
         * Traverses the current AnimationStrcuture to find the totalTime of this animation.
         * @param _structure The structure to traverse
         */
        traverseStructureForTime(_structure) {
            for (let n in _structure) {
                if (_structure[n] instanceof FudgeCore.AnimationSequence) {
                    let sequence = _structure[n];
                    if (sequence.length > 0) {
                        let sequenceTime = sequence.getKey(sequence.length - 1).Time;
                        this.totalTime = sequenceTime > this.totalTime ? sequenceTime : this.totalTime;
                    }
                }
                else {
                    this.traverseStructureForTime(_structure[n]);
                }
            }
        }
        /**
         * Ensures the existance of the requested [[AnimationStrcuture]] and returns it.
         * @param _type the type of the structure to get
         * @returns the requested [[AnimationStructure]]
         */
        getProcessedAnimationStructure(_type) {
            if (!this.animationStructuresProcessed.has(_type)) {
                this.calculateTotalTime();
                let ae = {};
                switch (_type) {
                    case ANIMATION_STRUCTURE_TYPE.NORMAL:
                        ae = this.animationStructure;
                        break;
                    case ANIMATION_STRUCTURE_TYPE.REVERSE:
                        ae = this.traverseStructureForNewStructure(this.animationStructure, this.calculateReverseSequence.bind(this));
                        break;
                    case ANIMATION_STRUCTURE_TYPE.RASTERED:
                        ae = this.traverseStructureForNewStructure(this.animationStructure, this.calculateRasteredSequence.bind(this));
                        break;
                    case ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE:
                        ae = this.traverseStructureForNewStructure(this.getProcessedAnimationStructure(ANIMATION_STRUCTURE_TYPE.REVERSE), this.calculateRasteredSequence.bind(this));
                        break;
                    default:
                        return {};
                }
                this.animationStructuresProcessed.set(_type, ae);
            }
            return this.animationStructuresProcessed.get(_type);
        }
        /**
         * Ensures the existance of the requested [[AnimationEventTrigger]] and returns it.
         * @param _type The type of AnimationEventTrigger to get
         * @returns the requested [[AnimationEventTrigger]]
         */
        getProcessedEventTrigger(_type) {
            if (!this.eventsProcessed.has(_type)) {
                this.calculateTotalTime();
                let ev = {};
                switch (_type) {
                    case ANIMATION_STRUCTURE_TYPE.NORMAL:
                        ev = this.events;
                        break;
                    case ANIMATION_STRUCTURE_TYPE.REVERSE:
                        ev = this.calculateReverseEventTriggers(this.events);
                        break;
                    case ANIMATION_STRUCTURE_TYPE.RASTERED:
                        ev = this.calculateRasteredEventTriggers(this.events);
                        break;
                    case ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE:
                        ev = this.calculateRasteredEventTriggers(this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.REVERSE));
                        break;
                    default:
                        return {};
                }
                this.eventsProcessed.set(_type, ev);
            }
            return this.eventsProcessed.get(_type);
        }
        /**
         * Traverses an existing structure to apply a recalculation function to the AnimationStructure to store in a new Structure.
         * @param _oldStructure The old structure to traverse
         * @param _functionToUse The function to use to recalculated the structure.
         * @returns A new Animation Structure with the recalulated Animation Sequences.
         */
        traverseStructureForNewStructure(_oldStructure, _functionToUse) {
            let newStructure = {};
            for (let n in _oldStructure) {
                if (_oldStructure[n] instanceof FudgeCore.AnimationSequence) {
                    newStructure[n] = _functionToUse(_oldStructure[n]);
                }
                else {
                    newStructure[n] = this.traverseStructureForNewStructure(_oldStructure[n], _functionToUse);
                }
            }
            return newStructure;
        }
        /**
         * Creates a reversed Animation Sequence out of a given Sequence.
         * @param _sequence The sequence to calculate the new sequence out of
         * @returns The reversed Sequence
         */
        calculateReverseSequence(_sequence) {
            let seq = new FudgeCore.AnimationSequence();
            for (let i = 0; i < _sequence.length; i++) {
                let oldKey = _sequence.getKey(i);
                let key = new FudgeCore.AnimationKey(this.totalTime - oldKey.Time, oldKey.Value, oldKey.SlopeOut, oldKey.SlopeIn, oldKey.Constant);
                seq.addKey(key);
            }
            return seq;
        }
        /**
         * Creates a rastered [[AnimationSequence]] out of a given sequence.
         * @param _sequence The sequence to calculate the new sequence out of
         * @returns the rastered sequence.
         */
        calculateRasteredSequence(_sequence) {
            let seq = new FudgeCore.AnimationSequence();
            let frameTime = 1000 / this.framesPerSecond;
            for (let i = 0; i < this.totalTime; i += frameTime) {
                let key = new FudgeCore.AnimationKey(i, _sequence.evaluate(i), 0, 0, true);
                seq.addKey(key);
            }
            return seq;
        }
        /**
         * Creates a new reversed [[AnimationEventTrigger]] object based on the given one.
         * @param _events the event object to calculate the new one out of
         * @returns the reversed event object
         */
        calculateReverseEventTriggers(_events) {
            let ae = {};
            for (let name in _events) {
                ae[name] = this.totalTime - _events[name];
            }
            return ae;
        }
        /**
         * Creates a rastered [[AnimationEventTrigger]] object based on the given one.
         * @param _events the event object to calculate the new one out of
         * @returns the rastered event object
         */
        calculateRasteredEventTriggers(_events) {
            let ae = {};
            let frameTime = 1000 / this.framesPerSecond;
            for (let name in _events) {
                ae[name] = _events[name] - (_events[name] % frameTime);
            }
            return ae;
        }
        /**
         * Checks which events lay between two given times and returns the names of the ones that do.
         * @param _eventTriggers The event object to check the events inside of
         * @param _min the minimum of the range to check between (inclusive)
         * @param _max the maximum of the range to check between (exclusive)
         * @returns an array of the names of the events in the given range.
         */
        checkEventsBetween(_eventTriggers, _min, _max) {
            let eventsToTrigger = [];
            for (let name in _eventTriggers) {
                if (_min <= _eventTriggers[name] && _eventTriggers[name] < _max) {
                    eventsToTrigger.push(name);
                }
            }
            return eventsToTrigger;
        }
    }
    FudgeCore.Animation = Animation;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
var FudgeCore;
// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
(function (FudgeCore) {
    /**
     * Calculates the values between [[AnimationKey]]s.
     * Represented internally by a cubic function (`f(x) = ax³ + bx² + cx + d`).
     * Only needs to be recalculated when the keys change, so at runtime it should only be calculated once.
     * @author Lukas Scheuerle, HFU, 2019
     */
    class AnimationFunction {
        constructor(_keyIn, _keyOut = null) {
            this.a = 0;
            this.b = 0;
            this.c = 0;
            this.d = 0;
            this.keyIn = _keyIn;
            this.keyOut = _keyOut;
            this.calculate();
        }
        /**
         * Calculates the value of the function at the given time.
         * @param _time the point in time at which to evaluate the function in milliseconds. Will be corrected for offset internally.
         * @returns the value at the given time
         */
        evaluate(_time) {
            _time -= this.keyIn.Time;
            let time2 = _time * _time;
            let time3 = time2 * _time;
            return this.a * time3 + this.b * time2 + this.c * _time + this.d;
        }
        set setKeyIn(_keyIn) {
            this.keyIn = _keyIn;
            this.calculate();
        }
        set setKeyOut(_keyOut) {
            this.keyOut = _keyOut;
            this.calculate();
        }
        /**
         * (Re-)Calculates the parameters of the cubic function.
         * See https://math.stackexchange.com/questions/3173469/calculate-cubic-equation-from-two-points-and-two-slopes-variably
         * and https://jirkadelloro.github.io/FUDGE/Documentation/Logs/190410_Notizen_LS
         */
        calculate() {
            if (!this.keyIn) {
                this.d = this.c = this.b = this.a = 0;
                return;
            }
            if (!this.keyOut || this.keyIn.Constant) {
                this.d = this.keyIn.Value;
                this.c = this.b = this.a = 0;
                return;
            }
            let x1 = this.keyOut.Time - this.keyIn.Time;
            this.d = this.keyIn.Value;
            this.c = this.keyIn.SlopeOut;
            this.a = (-x1 * (this.keyIn.SlopeOut + this.keyOut.SlopeIn) - 2 * this.keyIn.Value + 2 * this.keyOut.Value) / -Math.pow(x1, 3);
            this.b = (this.keyOut.SlopeIn - this.keyIn.SlopeOut - 3 * this.a * Math.pow(x1, 2)) / (2 * x1);
        }
    }
    FudgeCore.AnimationFunction = AnimationFunction;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
var FudgeCore;
// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
(function (FudgeCore) {
    /**
     * Holds information about set points in time, their accompanying values as well as their slopes.
     * Also holds a reference to the [[AnimationFunction]]s that come in and out of the sides. The [[AnimationFunction]]s are handled by the [[AnimationSequence]]s.
     * Saved inside an [[AnimationSequence]].
     * @author Lukas Scheuerle, HFU, 2019
     */
    class AnimationKey extends FudgeCore.Mutable {
        constructor(_time = 0, _value = 0, _slopeIn = 0, _slopeOut = 0, _constant = false) {
            super();
            this.constant = false;
            this.slopeIn = 0;
            this.slopeOut = 0;
            this.time = _time;
            this.value = _value;
            this.slopeIn = _slopeIn;
            this.slopeOut = _slopeOut;
            this.constant = _constant;
            this.broken = this.slopeIn != -this.slopeOut;
            this.functionOut = new FudgeCore.AnimationFunction(this, null);
        }
        /**
         * Static comparation function to use in an array sort function to sort the keys by their time.
         * @param _a the animation key to check
         * @param _b the animation key to check against
         * @returns >0 if a>b, 0 if a=b, <0 if a<b
         */
        static compare(_a, _b) {
            return _a.time - _b.time;
        }
        get Time() {
            return this.time;
        }
        set Time(_time) {
            this.time = _time;
            this.functionIn.calculate();
            this.functionOut.calculate();
        }
        get Value() {
            return this.value;
        }
        set Value(_value) {
            this.value = _value;
            this.functionIn.calculate();
            this.functionOut.calculate();
        }
        get Constant() {
            return this.constant;
        }
        set Constant(_constant) {
            this.constant = _constant;
            this.functionIn.calculate();
            this.functionOut.calculate();
        }
        get SlopeIn() {
            return this.slopeIn;
        }
        set SlopeIn(_slope) {
            this.slopeIn = _slope;
            this.functionIn.calculate();
        }
        get SlopeOut() {
            return this.slopeOut;
        }
        set SlopeOut(_slope) {
            this.slopeOut = _slope;
            this.functionOut.calculate();
        }
        //#region transfer
        serialize() {
            let s = {};
            s.time = this.time;
            s.value = this.value;
            s.slopeIn = this.slopeIn;
            s.slopeOut = this.slopeOut;
            s.constant = this.constant;
            return s;
        }
        async deserialize(_serialization) {
            this.time = _serialization.time;
            this.value = _serialization.value;
            this.slopeIn = _serialization.slopeIn;
            this.slopeOut = _serialization.slopeOut;
            this.constant = _serialization.constant;
            this.broken = this.slopeIn != -this.slopeOut;
            return this;
        }
        getMutator() {
            return this.serialize();
        }
        reduceMutator(_mutator) {
            //
        }
    }
    FudgeCore.AnimationKey = AnimationKey;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * A sequence of [[AnimationKey]]s that is mapped to an attribute of a [[Node]] or its [[Component]]s inside the [[Animation]].
     * Provides functions to modify said keys
     * @author Lukas Scheuerle, HFU, 2019
     */
    class AnimationSequence extends FudgeCore.Mutable {
        constructor() {
            super(...arguments);
            this.keys = [];
        }
        get length() {
            return this.keys.length;
        }
        /**
         * Evaluates the sequence at the given point in time.
         * @param _time the point in time at which to evaluate the sequence in milliseconds.
         * @returns the value of the sequence at the given time. 0 if there are no keys.
         */
        evaluate(_time) {
            if (this.keys.length == 0)
                return 0; //TODO: shouldn't return 0 but something indicating no change, like null. probably needs to be changed in Node as well to ignore non-numeric values in the applyAnimation function
            if (this.keys.length == 1 || this.keys[0].Time >= _time)
                return this.keys[0].Value;
            for (let i = 0; i < this.keys.length - 1; i++) {
                if (this.keys[i].Time <= _time && this.keys[i + 1].Time > _time) {
                    return this.keys[i].functionOut.evaluate(_time);
                }
            }
            return this.keys[this.keys.length - 1].Value;
        }
        /**
         * Adds a new key to the sequence.
         * @param _key the key to add
         */
        addKey(_key) {
            this.keys.push(_key);
            this.keys.sort(FudgeCore.AnimationKey.compare);
            this.regenerateFunctions();
        }
        /**
         * Removes a given key from the sequence.
         * @param _key the key to remove
         */
        removeKey(_key) {
            for (let i = 0; i < this.keys.length; i++) {
                if (this.keys[i] == _key) {
                    this.keys.splice(i, 1);
                    this.regenerateFunctions();
                    return;
                }
            }
        }
        /**
         * Removes the Animation Key at the given index from the keys.
         * @param _index the zero-based index at which to remove the key
         * @returns the removed AnimationKey if successful, null otherwise.
         */
        removeKeyAtIndex(_index) {
            if (_index < 0 || _index >= this.keys.length) {
                return null;
            }
            let ak = this.keys[_index];
            this.keys.splice(_index, 1);
            this.regenerateFunctions();
            return ak;
        }
        /**
         * Gets a key from the sequence at the desired index.
         * @param _index the zero-based index at which to get the key
         * @returns the AnimationKey at the index if it exists, null otherwise.
         */
        getKey(_index) {
            if (_index < 0 || _index >= this.keys.length)
                return null;
            return this.keys[_index];
        }
        //#region transfer
        serialize() {
            let s = {
                keys: [],
                animationSequence: true
            };
            for (let i = 0; i < this.keys.length; i++) {
                s.keys[i] = this.keys[i].serialize();
            }
            return s;
        }
        async deserialize(_serialization) {
            for (let i = 0; i < _serialization.keys.length; i++) {
                // this.keys.push(<AnimationKey>Serializer.deserialize(_serialization.keys[i]));
                let k = new FudgeCore.AnimationKey();
                k.deserialize(_serialization.keys[i]);
                this.keys[i] = k;
            }
            this.regenerateFunctions();
            return this;
        }
        reduceMutator(_mutator) {
            //
        }
        //#endregion
        /**
         * Utility function that (re-)generates all functions in the sequence.
         */
        regenerateFunctions() {
            for (let i = 0; i < this.keys.length; i++) {
                let f = new FudgeCore.AnimationFunction(this.keys[i]);
                this.keys[i].functionOut = f;
                if (i == this.keys.length - 1) {
                    //TODO: check if this is even useful. Maybe update the runcondition to length - 1 instead. Might be redundant if functionIn is removed, see TODO in AnimationKey.
                    f.setKeyOut = this.keys[0];
                    this.keys[0].functionIn = f;
                    break;
                }
                f.setKeyOut = this.keys[i + 1];
                this.keys[i + 1].functionIn = f;
            }
        }
    }
    FudgeCore.AnimationSequence = AnimationSequence;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Extension of AudioBuffer with a load method that creates a buffer in the [[AudioManager]].default to be used with [[ComponentAudio]]
     * @authors Thomas Dorner, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class Audio extends FudgeCore.Mutable {
        constructor(_url) {
            super();
            this.name = "Audio";
            this.idResource = undefined;
            this.buffer = undefined;
            this.path = undefined;
            this.url = undefined;
            this.ready = false;
            if (_url) {
                this.load(_url);
                this.name = _url.toString().split("/").pop();
            }
            FudgeCore.Project.register(this);
        }
        get isReady() {
            return this.ready;
        }
        /**
         * Asynchronously loads the audio (mp3) from the given url
         */
        async load(_url) {
            console.log("AudioLoad", _url);
            this.url = _url;
            this.ready = false;
            this.path = new URL(this.url.toString(), FudgeCore.Project.baseURL);
            const response = await window.fetch(this.path.toString());
            const arrayBuffer = await response.arrayBuffer();
            let buffer = await FudgeCore.AudioManager.default.decodeAudioData(arrayBuffer);
            this.buffer = buffer;
            this.ready = true;
            this.dispatchEvent(new Event("ready" /* READY */));
        }
        //#region Transfer
        serialize() {
            return {
                url: this.url,
                idResource: this.idResource,
                name: this.name,
                type: this.type
            };
        }
        async deserialize(_serialization) {
            FudgeCore.Project.register(this, _serialization.idResource);
            await this.load(_serialization.url);
            this.name = _serialization.name;
            return this;
        }
        async mutate(_mutator) {
            let url = _mutator.url; // save url for reconstruction after exclusion
            if (_mutator.url != this.url.toString())
                this.load(_mutator.url);
            // except url from mutator for further processing
            delete (_mutator.url);
            super.mutate(_mutator);
            // reconstruct, for mutator may be kept by caller
            _mutator.url = url;
        }
        reduceMutator(_mutator) {
            // delete _mutator.idResource; 
            delete _mutator.ready;
        }
    }
    FudgeCore.Audio = Audio;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Extends the standard AudioContext for integration with FUDGE-graphs.
     * Creates a default object at startup to be addressed as AudioManager default.
     * Other objects of this class may be create for special purposes.
     */
    class AudioManager extends AudioContext {
        constructor(contextOptions) {
            super(contextOptions);
            this.graph = null;
            this.cmpListener = null;
            /**
             * Determines FUDGE-graph to listen to. Each [[ComponentAudio]] in the graph will connect to this contexts master gain, all others disconnect.
             */
            this.listenTo = (_graph) => {
                if (this.graph)
                    this.graph.broadcastEvent(new Event("childRemoveFromAudioGraph" /* CHILD_REMOVE */));
                if (!_graph)
                    return;
                this.graph = _graph;
                this.graph.broadcastEvent(new Event("childAppendToAudioGraph" /* CHILD_APPEND */));
            };
            /**
             * Retrieve the FUDGE-graph currently listening to
             */
            this.getGraphListeningTo = () => {
                return this.graph;
            };
            /**
             * Set the [[ComponentAudioListener]] that serves the spatial location and orientation for this contexts listener
             */
            this.listenWith = (_cmpListener) => {
                this.cmpListener = _cmpListener;
            };
            /**
             * Updates the spatial settings of the AudioNodes effected in the current FUDGE-graph
             */
            this.update = () => {
                this.graph.broadcastEvent(new Event("updateAudioGraph" /* UPDATE */));
                if (this.cmpListener)
                    this.cmpListener.update(this.listener);
            };
            this.gain = this.createGain();
            this.gain.connect(this.destination);
        }
        /**
         * Set the master volume
         */
        set volume(_value) {
            this.gain.gain.value = _value;
        }
        /**
         * Get the master volume
         */
        get volume() {
            return this.gain.gain.value;
        }
    }
    /** The default context that may be used throughout the project without the need to create others */
    AudioManager.default = new AudioManager({ latencyHint: "interactive", sampleRate: 44100 });
    FudgeCore.AudioManager = AudioManager;
})(FudgeCore || (FudgeCore = {}));
// namespace FudgeCore {
//     /**
//      * Enumerator for all possible Oscillator Types
//      */
//     type OSCILLATOR_TYPE = "sine" | "square" | "sawtooth" | "triangle" | "custom";
//     /**
//      * Interface to create Custom Oscillator Types.
//      * Start-/Endpoint of a custum curve e.g. sine curve.
//      * Both parameters need to be inbetween -1 and 1.
//      * @param startpoint startpoint of a curve 
//      * @param endpoint Endpoint of a curve 
//      */
//     interface OscillatorWave {
//         startpoint: number;
//         endpoint: number;
//     }
//     /**
//      * Add an [[AudioFilter]] to an [[Audio]]
//      * @authors Thomas Dorner, HFU, 2019
//      */
//     export class AudioOscillator {
//         public audioOscillator: OscillatorNode; 
//         private frequency: number;
//         private oscillatorType: OSCILLATOR_TYPE;
//         private oscillatorWave: PeriodicWave;
//         private localGain: GainNode;
//         private localGainValue: number;
//         constructor(_audioSettings: AudioSettings, _oscillatorType?: OSCILLATOR_TYPE) {
//             this.audioOscillator = _audioSettings.getAudioContext().createOscillator();
//             this.localGain = _audioSettings.getAudioContext().createGain();
//             this.oscillatorType = _oscillatorType;
//             if (this.oscillatorType != "custom") {
//                 this.audioOscillator.type = this.oscillatorType;
//             }
//             else {
//                 if (!this.oscillatorWave) {
//                     this.audioOscillator.setPeriodicWave(this.oscillatorWave);
//                 }
//                 else {
//                     console.log("Create a Custom Periodic Wave first to use Custom Type");
//                 }
//             }
//         }
//         public setOscillatorType(_oscillatorType: OSCILLATOR_TYPE): void {
//             if (this.oscillatorType != "custom") {
//                 this.audioOscillator.type = this.oscillatorType;
//             }
//             else {
//                 if (!this.oscillatorWave) {
//                     this.audioOscillator.setPeriodicWave(this.oscillatorWave);
//                 }
//             }
//         }
//         public getOscillatorType(): OSCILLATOR_TYPE {
//             return this.oscillatorType;
//         }
//         public createPeriodicWave(_audioSettings: AudioSettings, _real: OscillatorWave, _imag: OscillatorWave): void {
//             let waveReal: Float32Array = new Float32Array(2);
//             waveReal[0] = _real.startpoint;
//             waveReal[1] = _real.endpoint;
//             let waveImag: Float32Array = new Float32Array(2);
//             waveImag[0] = _imag.startpoint;
//             waveImag[1] = _imag.endpoint;
//             this.oscillatorWave = _audioSettings.getAudioContext().createPeriodicWave(waveReal, waveImag);
//         }
//         public setLocalGain(_localGain: GainNode): void {
//             this.localGain = _localGain;
//         }
//         public getLocalGain(): GainNode {
//             return this.localGain;
//         }
//         public setLocalGainValue(_localGainValue: number): void {
//             this.localGainValue = _localGainValue;
//             this.localGain.gain.value = this.localGainValue;
//         }
//         public getLocalGainValue(): number {
//             return this.localGainValue;
//         }
//         public setFrequency(_audioSettings: AudioSettings, _frequency: number): void {
//             this.frequency = _frequency;
//             this.audioOscillator.frequency.setValueAtTime(this.frequency, _audioSettings.getAudioContext().currentTime);
//         }
//         public getFrequency(): number {
//             return this.frequency;
//         }
//         public createSnare(_audioSettings: AudioSettings): void {
//             this.setOscillatorType("triangle");
//             this.setFrequency(_audioSettings, 100);
//             this.setLocalGainValue(0);
//             this.localGain.gain.setValueAtTime(0, _audioSettings.getAudioContext().currentTime);
//             this.localGain.gain.exponentialRampToValueAtTime(0.01, _audioSettings.getAudioContext().currentTime + .1);
//             this.audioOscillator.connect(this.localGain);
//         }
//     }
// }
var FudgeCore;
(function (FudgeCore) {
    /**
     * Holds data to feed into a [[Shader]] to describe the surface of [[Mesh]].
     * [[Material]]s reference [[Coat]] and [[Shader]].
     * The method useRenderData will be injected by [[RenderInjector]] at runtime, extending the functionality of this class to deal with the renderer.
     */
    class Coat extends FudgeCore.Mutable {
        constructor() {
            super(...arguments);
            this.name = "Coat";
            //#endregion
        }
        useRenderData(_shader, _cmpMaterial) { }
        //#region Transfer
        serialize() {
            let serialization = { name: this.name };
            return serialization;
        }
        async deserialize(_serialization) {
            this.name = _serialization.name;
            return this;
        }
        reduceMutator() { }
    }
    FudgeCore.Coat = Coat;
    /**
     * The simplest [[Coat]] providing just a color
     */
    let CoatColored = class CoatColored extends Coat {
        constructor(_color) {
            super();
            this.color = _color || new FudgeCore.Color(0.5, 0.5, 0.5, 1);
        }
        //#region Transfer
        serialize() {
            let serialization = super.serialize();
            serialization.color = this.color.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            super.deserialize(_serialization);
            this.color.deserialize(_serialization.color);
            return this;
        }
    };
    CoatColored = __decorate([
        FudgeCore.RenderInjectorCoat.decorate
    ], CoatColored);
    FudgeCore.CoatColored = CoatColored;
    /**
     * A [[Coat]] to be used by the MatCap Shader providing a texture, a tint color (0.5 grey is neutral). Set shadeSmooth to 1 for smooth shading.
     */
    let CoatMatCap = class CoatMatCap extends Coat {
        constructor(_texture, _color, _shadeSmooth) {
            super();
            this.texture = null;
            this.color = new FudgeCore.Color(0.5, 0.5, 0.5, 1);
            this.texture = _texture || new FudgeCore.TextureImage();
            this.color = _color || new FudgeCore.Color(0.5, 0.5, 0.5, 1);
            this.shadeSmooth = _shadeSmooth || 0;
        }
    };
    CoatMatCap = __decorate([
        FudgeCore.RenderInjectorCoat.decorate
    ], CoatMatCap);
    FudgeCore.CoatMatCap = CoatMatCap;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * A [[Coat]] providing a texture and additional data for texturing
     */
    let CoatTextured = class CoatTextured extends FudgeCore.CoatColored {
        constructor(_color, _texture) {
            super(_color);
            // TODO: see if color should be generalized
            // public color: Color = new Color(1, 1, 1, 1);
            this.texture = null;
            if (_texture)
                this.texture = _texture;
        }
        //#region Transfer
        //TODO: examine using super in serialization is works with decorators... should.
        serialize() {
            let serialization = super.serialize();
            delete serialization.texture;
            serialization.idTexture = this.texture.idResource;
            return serialization;
        }
        async deserialize(_serialization) {
            super.deserialize(_serialization);
            this.texture = await FudgeCore.Project.getResource(_serialization.idTexture);
            return this;
        }
    };
    CoatTextured = __decorate([
        FudgeCore.RenderInjectorCoat.decorate
    ], CoatTextured);
    FudgeCore.CoatTextured = CoatTextured;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
var FudgeCore;
// / <reference path="../Transfer/Serializer.ts"/>
// / <reference path="../Transfer/Mutable.ts"/>
(function (FudgeCore) {
    /**
     * Superclass for all [[Component]]s that can be attached to [[Node]]s.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2020 | Jascha Karagöl, HFU, 2019
     * @link https://github.com/JirkaDellOro/FUDGE/wiki/Component
     */
    class Component extends FudgeCore.Mutable {
        constructor() {
            super(...arguments);
            this.singleton = true;
            this.container = null;
            this.active = true;
            //#endregion
        }
        static registerSubclass(_subclass) { return Component.subclasses.push(_subclass) - 1; }
        get isActive() {
            return this.active;
        }
        /**
         * Is true, when only one instance of the component class can be attached to a node
         */
        get isSingleton() {
            return this.singleton;
        }
        activate(_on) {
            this.active = _on;
            this.dispatchEvent(new Event(_on ? "componentActivate" /* COMPONENT_ACTIVATE */ : "componentDeactivate" /* COMPONENT_DEACTIVATE */));
        }
        /**
         * Retrieves the node, this component is currently attached to
         * @returns The container node or null, if the component is not attached to
         */
        getContainer() {
            return this.container;
        }
        /**
         * Tries to add the component to the given node, removing it from the previous container if applicable
         * @param _container The node to attach this component to
         */
        setContainer(_container) {
            if (this.container == _container)
                return;
            let previousContainer = this.container;
            try {
                if (previousContainer)
                    previousContainer.removeComponent(this);
                this.container = _container;
                if (this.container)
                    this.container.addComponent(this);
            }
            catch (_error) {
                this.container = previousContainer;
            }
        }
        //#region Transfer
        serialize() {
            let serialization = {
                active: this.active
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.active = _serialization.active;
            return this;
        }
        reduceMutator(_mutator) {
            delete _mutator.singleton;
            delete _mutator.container;
        }
    }
    /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
    Component.baseClass = Component;
    /** list of all the subclasses derived from this class, if they registered properly*/
    Component.subclasses = [];
    FudgeCore.Component = Component;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="../Time/Loop.ts"/>
// / <reference path="../Animation/Animation.ts"/>
var FudgeCore;
// / <reference path="../Time/Loop.ts"/>
// / <reference path="../Animation/Animation.ts"/>
(function (FudgeCore) {
    /**
     * Holds different playmodes the animation uses to play back its animation.
     * @author Lukas Scheuerle, HFU, 2019
     */
    let ANIMATION_PLAYMODE;
    (function (ANIMATION_PLAYMODE) {
        /**Plays animation in a loop: it restarts once it hit the end.*/
        ANIMATION_PLAYMODE[ANIMATION_PLAYMODE["LOOP"] = 0] = "LOOP";
        /**Plays animation once and stops at the last key/frame*/
        ANIMATION_PLAYMODE[ANIMATION_PLAYMODE["PLAYONCE"] = 1] = "PLAYONCE";
        /**Plays animation once and stops on the first key/frame */
        ANIMATION_PLAYMODE[ANIMATION_PLAYMODE["PLAYONCESTOPAFTER"] = 2] = "PLAYONCESTOPAFTER";
        /**Plays animation like LOOP, but backwards.*/
        ANIMATION_PLAYMODE[ANIMATION_PLAYMODE["REVERSELOOP"] = 3] = "REVERSELOOP";
        /**Causes the animation not to play at all. Useful for jumping to various positions in the animation without proceeding in the animation.*/
        ANIMATION_PLAYMODE[ANIMATION_PLAYMODE["STOP"] = 4] = "STOP";
        //TODO: add an INHERIT and a PINGPONG mode
    })(ANIMATION_PLAYMODE = FudgeCore.ANIMATION_PLAYMODE || (FudgeCore.ANIMATION_PLAYMODE = {}));
    let ANIMATION_PLAYBACK;
    (function (ANIMATION_PLAYBACK) {
        //TODO: add an in-depth description of what happens to the animation (and events) depending on the Playback. Use Graphs to explain.
        /**Calculates the state of the animation at the exact position of time. Ignores FPS value of animation.*/
        ANIMATION_PLAYBACK[ANIMATION_PLAYBACK["TIMEBASED_CONTINOUS"] = 0] = "TIMEBASED_CONTINOUS";
        /**Limits the calculation of the state of the animation to the FPS value of the animation. Skips frames if needed.*/
        ANIMATION_PLAYBACK[ANIMATION_PLAYBACK["TIMEBASED_RASTERED_TO_FPS"] = 1] = "TIMEBASED_RASTERED_TO_FPS";
        /**Uses the FPS value of the animation to advance once per frame, no matter the speed of the frames. Doesn't skip any frames.*/
        ANIMATION_PLAYBACK[ANIMATION_PLAYBACK["FRAMEBASED"] = 2] = "FRAMEBASED";
    })(ANIMATION_PLAYBACK = FudgeCore.ANIMATION_PLAYBACK || (FudgeCore.ANIMATION_PLAYBACK = {}));
    /**
     * Holds a reference to an [[Animation]] and controls it. Controls playback and playmode as well as speed.
     * @authors Lukas Scheuerle, HFU, 2019
     */
    class ComponentAnimator extends FudgeCore.Component {
        constructor(_animation = new FudgeCore.Animation(""), _playmode = ANIMATION_PLAYMODE.LOOP, _playback = ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS) {
            super();
            this.speedScalesWithGlobalSpeed = true;
            this.speedScale = 1;
            this.lastTime = 0;
            this.animation = _animation;
            this.playmode = _playmode;
            this.playback = _playback;
            this.localTime = new FudgeCore.Time();
            //TODO: update animation total time when loading a different animation?
            this.animation.calculateTotalTime();
            FudgeCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.updateAnimationLoop.bind(this));
            FudgeCore.Time.game.addEventListener("timeScaled" /* TIME_SCALED */, this.updateScale.bind(this));
        }
        set speed(_s) {
            this.speedScale = _s;
            this.updateScale();
        }
        /**
         * Jumps to a certain time in the animation to play from there.
         * @param _time The time to jump to
         */
        jumpTo(_time) {
            this.localTime.set(_time);
            this.lastTime = _time;
            _time = _time % this.animation.totalTime;
            let mutator = this.animation.getMutated(_time, this.calculateDirection(_time), this.playback);
            this.getContainer().applyAnimation(mutator);
        }
        /**
         * Returns the current time of the animation, modulated for animation length.
         */
        getCurrentTime() {
            return this.localTime.get() % this.animation.totalTime;
        }
        /**
         * Forces an update of the animation from outside. Used in the ViewAnimation. Shouldn't be used during the game.
         * @param _time the (unscaled) time to update the animation with.
         * @returns a Tupel containing the Mutator for Animation and the playmode corrected time.
         */
        updateAnimation(_time) {
            return this.updateAnimationLoop(null, _time);
        }
        //#region transfer
        serialize() {
            let s = super.serialize();
            s["animation"] = this.animation.serialize();
            s["playmode"] = this.playmode;
            s["playback"] = this.playback;
            s["speedScale"] = this.speedScale;
            s["speedScalesWithGlobalSpeed"] = this.speedScalesWithGlobalSpeed;
            s[super.constructor.name] = super.serialize();
            return s;
        }
        async deserialize(_s) {
            this.animation = new FudgeCore.Animation("");
            this.animation.deserialize(_s.animation);
            this.playback = _s.playback;
            this.playmode = _s.playmode;
            this.speedScale = _s.speedScale;
            this.speedScalesWithGlobalSpeed = _s.speedScalesWithGlobalSpeed;
            super.deserialize(_s[super.constructor.name]);
            return this;
        }
        //#endregion
        //#region updateAnimation
        /**
         * Updates the Animation.
         * Gets called every time the Loop fires the LOOP_FRAME Event.
         * Uses the built-in time unless a different time is specified.
         * May also be called from updateAnimation().
         */
        updateAnimationLoop(_e, _time) {
            if (this.animation.totalTime == 0)
                return [null, 0];
            let time = _time || this.localTime.get();
            if (this.playback == ANIMATION_PLAYBACK.FRAMEBASED) {
                time = this.lastTime + (1000 / this.animation.fps);
            }
            let direction = this.calculateDirection(time);
            time = this.applyPlaymodes(time);
            this.executeEvents(this.animation.getEventsToFire(this.lastTime, time, this.playback, direction));
            if (this.lastTime != time) {
                this.lastTime = time;
                time = time % this.animation.totalTime;
                let mutator = this.animation.getMutated(time, direction, this.playback);
                if (this.getContainer()) {
                    this.getContainer().applyAnimation(mutator);
                }
                return [mutator, time];
            }
            return [null, time];
        }
        /**
         * Fires all custom events the Animation should have fired between the last frame and the current frame.
         * @param events a list of names of custom events to fire
         */
        executeEvents(events) {
            for (let i = 0; i < events.length; i++) {
                this.dispatchEvent(new Event(events[i]));
            }
        }
        /**
         * Calculates the actual time to use, using the current playmodes.
         * @param _time the time to apply the playmodes to
         * @returns the recalculated time
         */
        applyPlaymodes(_time) {
            switch (this.playmode) {
                case ANIMATION_PLAYMODE.STOP:
                    return this.localTime.getOffset();
                case ANIMATION_PLAYMODE.PLAYONCE:
                    if (_time >= this.animation.totalTime)
                        return this.animation.totalTime - 0.01; //TODO: this might cause some issues
                    else
                        return _time;
                case ANIMATION_PLAYMODE.PLAYONCESTOPAFTER:
                    if (_time >= this.animation.totalTime)
                        return this.animation.totalTime + 0.01; //TODO: this might cause some issues
                    else
                        return _time;
                default:
                    return _time;
            }
        }
        /**
         * Calculates and returns the direction the animation should currently be playing in.
         * @param _time the time at which to calculate the direction
         * @returns 1 if forward, 0 if stop, -1 if backwards
         */
        calculateDirection(_time) {
            switch (this.playmode) {
                case ANIMATION_PLAYMODE.STOP:
                    return 0;
                // case ANIMATION_PLAYMODE.PINGPONG:
                //   if (Math.floor(_time / this.animation.totalTime) % 2 == 0)
                //     return 1;
                //   else
                //     return -1;
                case ANIMATION_PLAYMODE.REVERSELOOP:
                    return -1;
                case ANIMATION_PLAYMODE.PLAYONCE:
                case ANIMATION_PLAYMODE.PLAYONCESTOPAFTER:
                    if (_time >= this.animation.totalTime) {
                        return 0;
                    }
                default:
                    return 1;
            }
        }
        /**
         * Updates the scale of the animation if the user changes it or if the global game timer changed its scale.
         */
        updateScale() {
            let newScale = this.speedScale;
            if (this.speedScalesWithGlobalSpeed)
                newScale *= FudgeCore.Time.game.getScale();
            this.localTime.setScale(newScale);
        }
    }
    ComponentAnimator.iSubclass = FudgeCore.Component.registerSubclass(ComponentAnimator);
    FudgeCore.ComponentAnimator = ComponentAnimator;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AUDIO_PANNER;
    (function (AUDIO_PANNER) {
        AUDIO_PANNER["CONE_INNER_ANGLE"] = "coneInnerAngle";
        AUDIO_PANNER["CONE_OUTER_ANGLE"] = "coneOuterAngle";
        AUDIO_PANNER["CONE_OUTER_GAIN"] = "coneOuterGain";
        AUDIO_PANNER["DISTANCE_MODEL"] = "distanceModel";
        AUDIO_PANNER["MAX_DISTANCE"] = "maxDistance";
        AUDIO_PANNER["PANNING_MODEL"] = "panningModel";
        AUDIO_PANNER["REF_DISTANCE"] = "refDistance";
        AUDIO_PANNER["ROLLOFF_FACTOR"] = "rolloffFactor";
    })(AUDIO_PANNER = FudgeCore.AUDIO_PANNER || (FudgeCore.AUDIO_PANNER = {}));
    let AUDIO_NODE_TYPE;
    (function (AUDIO_NODE_TYPE) {
        AUDIO_NODE_TYPE[AUDIO_NODE_TYPE["SOURCE"] = 0] = "SOURCE";
        AUDIO_NODE_TYPE[AUDIO_NODE_TYPE["PANNER"] = 1] = "PANNER";
        AUDIO_NODE_TYPE[AUDIO_NODE_TYPE["GAIN"] = 2] = "GAIN";
    })(AUDIO_NODE_TYPE = FudgeCore.AUDIO_NODE_TYPE || (FudgeCore.AUDIO_NODE_TYPE = {}));
    /**
     * Builds a minimal audio graph (by default in [[AudioManager]].default) and synchronizes it with the containing [[Node]]
     * ```plaintext
     * ┌ AudioManager(.default) ────────────────────────┐
     * │ ┌ ComponentAudio ───────────────────┐          │
     * │ │    ┌──────┐   ┌──────┐   ┌──────┐ │ ┌──────┐ │
     * │ │    │source│ → │panner│ → │ gain │ → │ gain │ │
     * │ │    └──────┘   └──────┘   └──────┘ │ └──────┘ │
     * │ └───────────────────────────────────┘          │
     * └────────────────────────────────────────────────┘
     * ```
     * @authors Thomas Dorner, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentAudio extends FudgeCore.Component {
        constructor(_audio = null, _loop = false, _start = false, _audioManager = FudgeCore.AudioManager.default) {
            super();
            /** places and directs the panner relative to the world transform of the [[Node]]  */
            this.pivot = FudgeCore.Matrix4x4.IDENTITY();
            this.singleton = false;
            this.playing = false;
            this.listened = false;
            //#endregion
            this.hndAudioReady = (_event) => {
                console.log("Start Audio!");
                if (this.playing)
                    this.play(true);
            };
            /**
             * Automatically connects/disconnects AudioNodes when adding/removing this component to/from a node.
             * Therefore unused AudioNodes may be garbage collected when an unused component is collected
             */
            this.handleAttach = (_event) => {
                // Debug.log(_event);
                if (_event.type == "componentAdd" /* COMPONENT_ADD */) {
                    this.getContainer().addEventListener("childAppendToAudioGraph" /* CHILD_APPEND */, this.handleGraph, true);
                    this.getContainer().addEventListener("childRemoveFromAudioGraph" /* CHILD_REMOVE */, this.handleGraph, true);
                    this.getContainer().addEventListener("updateAudioGraph" /* UPDATE */, this.update, true);
                    this.listened = this.getContainer().isDescendantOf(FudgeCore.AudioManager.default.getGraphListeningTo());
                }
                else {
                    this.getContainer().removeEventListener("childAppendToAudioGraph" /* CHILD_APPEND */, this.handleGraph, true);
                    this.getContainer().removeEventListener("childRemoveFromAudioGraph" /* CHILD_REMOVE */, this.handleGraph, true);
                    this.getContainer().removeEventListener("updateAudioGraph" /* UPDATE */, this.update, true);
                    this.listened = false;
                }
                this.updateConnection();
            };
            /**
             * Automatically connects/disconnects AudioNodes when appending/removing the FUDGE-graph the component is in.
             */
            this.handleGraph = (_event) => {
                // Debug.log(_event);
                this.listened = (_event.type == "childAppendToAudioGraph" /* CHILD_APPEND */);
                this.updateConnection();
            };
            /**
             * Updates the panner node, its position and direction, using the worldmatrix of the container and the pivot of this component.
             */
            this.update = (_event) => {
                let mtxResult = this.pivot;
                if (this.getContainer())
                    mtxResult = FudgeCore.Matrix4x4.MULTIPLICATION(this.getContainer().mtxWorld, this.pivot);
                // Debug.log(mtxResult.toString());
                let position = mtxResult.translation;
                let forward = FudgeCore.Vector3.TRANSFORMATION(FudgeCore.Vector3.Z(1), mtxResult, false);
                this.panner.positionX.value = position.x;
                this.panner.positionY.value = position.y;
                this.panner.positionZ.value = position.z;
                this.panner.orientationX.value = forward.x;
                this.panner.orientationY.value = forward.y;
                this.panner.orientationZ.value = forward.z;
            };
            this.install(_audioManager);
            this.createSource(_audio, _loop);
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.handleAttach);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.handleAttach);
            if (_start)
                this.play(_start);
        }
        set volume(_value) {
            this.gain.gain.value = _value;
        }
        get volume() {
            return this.gain.gain.value;
        }
        get isPlaying() {
            return this.playing;
        }
        get isAttached() {
            return this.getContainer() != null;
        }
        get isListened() {
            return this.listened;
        }
        setAudio(_audio) {
            this.createSource(_audio, this.source.loop);
        }
        /**
         * Set the property of the panner to the given value. Use to manipulate range and rolloff etc.
         */
        setPanner(_property, _value) {
            Object.assign(this.panner, { [_property]: _value });
        }
        // TODO: may be used for serialization of AudioNodes
        getMutatorOfNode(_type) {
            let node = this.getAudioNode(_type);
            let mutator = FudgeCore.getMutatorOfArbitrary(node);
            return mutator;
        }
        /**
         * Returns the specified AudioNode of the standard graph for further manipulation
         */
        getAudioNode(_type) {
            switch (_type) {
                case AUDIO_NODE_TYPE.SOURCE: return this.source;
                case AUDIO_NODE_TYPE.PANNER: return this.panner;
                case AUDIO_NODE_TYPE.GAIN: return this.gain;
            }
        }
        /**
         * Start or stop playing the audio
         */
        play(_on) {
            if (_on) {
                if (this.audio.isReady) {
                    this.createSource(this.audio, this.source.loop);
                    this.source.start(0, 0);
                }
                else
                    this.audio.addEventListener("ready" /* READY */, this.hndAudioReady);
            }
            else
                this.source.stop();
            this.playing = _on;
        }
        /**
         * Inserts AudioNodes between the panner and the local gain of this [[ComponentAudio]]
         * _input and _output may be the same AudioNode, if there is only one to insert,
         * or may have multiple AudioNode between them to create an effect-graph.\
         * Note that [[ComponentAudio]] does not keep track of inserted AudioNodes!
         * ```plaintext
         * ┌ AudioManager(.default) ──────────────────────────────────────────────────────┐
         * │ ┌ ComponentAudio ─────────────────────────────────────────────────┐          │
         * │ │    ┌──────┐   ┌──────┐   ┌──────┐          ┌───────┐   ┌──────┐ │ ┌──────┐ │
         * │ │    │source│ → │panner│ → │_input│ → ...  → │_output│ → │ gain │ → │ gain │ │
         * │ │    └──────┘   └──────┘   └──────┘          └───────┘   └──────┘ │ └──────┘ │
         * │ └─────────────────────────────────────────────────────────────────┘          │
         * └──────────────────────────────────────────────────────────────────────────────┘
         * ```
         */
        insertAudioNodes(_input, _output) {
            this.panner.disconnect(0);
            if (!_input && !_output) {
                this.panner.connect(this.gain);
                return;
            }
            this.panner.connect(_input);
            _output.connect(this.gain);
        }
        /**
         * Activate override. Connects or disconnects AudioNodes
         */
        activate(_on) {
            super.activate(_on);
            this.updateConnection();
        }
        /**
         * Connects this components gain-node to the gain node of the AudioManager this component runs on.
         * Only call this method if the component is not attached to a [[Node]] but needs to be heard.
         */
        connect(_on) {
            if (_on)
                this.gain.connect(this.audioManager.gain);
            else
                this.gain.disconnect(this.audioManager.gain);
        }
        //#region Transfer
        serialize() {
            let serialization = super.serialize();
            serialization.idResource = this.audio.idResource;
            serialization.playing = this.playing;
            serialization.loop = this.source.loop;
            serialization.volume = this.gain.gain.value;
            // console.log(this.getMutatorOfNode(AUDIO_NODE_TYPE.PANNER));
            // TODO: serialize panner parameters
            return serialization;
        }
        async deserialize(_serialization) {
            super.deserialize(_serialization);
            let audio = await FudgeCore.Project.getResource(_serialization.idResource);
            this.createSource(audio, _serialization.loop);
            this.volume = _serialization.volume;
            this.play(_serialization.playing);
            return this;
        }
        install(_audioManager = FudgeCore.AudioManager.default) {
            let active = this.isActive;
            this.activate(false);
            this.audioManager = _audioManager;
            this.panner = _audioManager.createPanner();
            this.gain = _audioManager.createGain();
            this.panner.connect(this.gain);
            this.gain.connect(_audioManager.gain);
            this.activate(active);
        }
        createSource(_audio, _loop) {
            if (this.source) {
                this.source.disconnect();
                this.source.buffer = null;
            }
            this.source = this.audioManager.createBufferSource();
            this.source.connect(this.panner);
            if (_audio) {
                this.audio = _audio;
                this.source.buffer = _audio.buffer;
            }
            this.source.loop = _loop;
        }
        updateConnection() {
            try {
                this.connect(this.isActive && this.isAttached && this.listened);
            }
            catch (_error) {
                // nop
            }
        }
    }
    ComponentAudio.iSubclass = FudgeCore.Component.registerSubclass(ComponentAudio);
    FudgeCore.ComponentAudio = ComponentAudio;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Serves to set the spatial location and orientation of AudioListeners relative to the
     * world transform of the [[Node]] it is attached to.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentAudioListener extends FudgeCore.Component {
        constructor() {
            super(...arguments);
            this.pivot = FudgeCore.Matrix4x4.IDENTITY();
        }
        /**
         * Updates the position and orientation of the given AudioListener
         */
        update(_listener) {
            let mtxResult = this.pivot;
            if (this.getContainer())
                mtxResult = FudgeCore.Matrix4x4.MULTIPLICATION(this.getContainer().mtxWorld, this.pivot);
            // Debug.log(mtxResult.toString());
            let position = mtxResult.translation;
            let forward = FudgeCore.Vector3.TRANSFORMATION(FudgeCore.Vector3.Z(1), mtxResult, false);
            let up = FudgeCore.Vector3.TRANSFORMATION(FudgeCore.Vector3.Y(), mtxResult, false);
            _listener.positionX.value = position.x;
            _listener.positionY.value = position.y;
            _listener.positionZ.value = position.z;
            _listener.forwardX.value = forward.x;
            _listener.forwardY.value = forward.y;
            _listener.forwardZ.value = forward.z;
            _listener.upX.value = up.x;
            _listener.upY.value = up.y;
            _listener.upZ.value = up.z;
            // Debug.log(mtxResult.translation.toString(), forward.toString(), up.toString());
        }
    }
    ComponentAudioListener.iSubclass = FudgeCore.Component.registerSubclass(ComponentAudioListener);
    FudgeCore.ComponentAudioListener = ComponentAudioListener;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="Component.ts"/>
var FudgeCore;
// / <reference path="Component.ts"/>
(function (FudgeCore) {
    let FIELD_OF_VIEW;
    (function (FIELD_OF_VIEW) {
        FIELD_OF_VIEW[FIELD_OF_VIEW["HORIZONTAL"] = 0] = "HORIZONTAL";
        FIELD_OF_VIEW[FIELD_OF_VIEW["VERTICAL"] = 1] = "VERTICAL";
        FIELD_OF_VIEW[FIELD_OF_VIEW["DIAGONAL"] = 2] = "DIAGONAL";
    })(FIELD_OF_VIEW = FudgeCore.FIELD_OF_VIEW || (FudgeCore.FIELD_OF_VIEW = {}));
    /**
     * Defines identifiers for the various projections a camera can provide.
     * TODO: change back to number enum if strings not needed
     */
    let PROJECTION;
    (function (PROJECTION) {
        PROJECTION["CENTRAL"] = "central";
        PROJECTION["ORTHOGRAPHIC"] = "orthographic";
        PROJECTION["DIMETRIC"] = "dimetric";
        PROJECTION["STEREO"] = "stereo";
    })(PROJECTION = FudgeCore.PROJECTION || (FudgeCore.PROJECTION = {}));
    /**
     * The camera component holds the projection-matrix and other data needed to render a scene from the perspective of the node it is attached to.
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentCamera extends FudgeCore.Component {
        constructor() {
            super(...arguments);
            this.pivot = FudgeCore.Matrix4x4.IDENTITY();
            this.backgroundColor = new FudgeCore.Color(0, 0, 0, 1); // The color of the background the camera will render.
            //private orthographic: boolean = false; // Determines whether the image will be rendered with perspective or orthographic projection.
            this.projection = PROJECTION.CENTRAL;
            this.transform = new FudgeCore.Matrix4x4; // The matrix to multiply each scene objects transformation by, to determine where it will be drawn.
            this.fieldOfView = 45; // The camera's sensorangle.
            this.aspectRatio = 1.0;
            this.direction = FIELD_OF_VIEW.DIAGONAL;
            this.near = 1;
            this.far = 2000;
            this.backgroundEnabled = true; // Determines whether or not the background of this camera will be rendered.
            //#endregion
        }
        // TODO: examine, if background should be an attribute of Camera or Viewport
        /**
         * Returns the multiplikation of the worldtransformation of the camera container with the projection matrix
         * @returns the world-projection-matrix
         */
        get ViewProjectionMatrix() {
            //TODO: optimize, no need to recalculate if neither mtxWorld nor pivot have changed
            let mtxCamera = this.pivot;
            try {
                mtxCamera = FudgeCore.Matrix4x4.MULTIPLICATION(this.getContainer().mtxWorld, this.pivot);
            }
            catch (_error) {
                // no container node or no world transformation found -> continue with pivot only
            }
            let mtxWorldProjection = FudgeCore.Matrix4x4.INVERSION(mtxCamera);
            mtxWorldProjection = FudgeCore.Matrix4x4.MULTIPLICATION(this.transform, mtxWorldProjection);
            return mtxWorldProjection;
        }
        getProjection() {
            return this.projection;
        }
        getBackgroundEnabled() {
            return this.backgroundEnabled;
        }
        getAspect() {
            return this.aspectRatio;
        }
        getFieldOfView() {
            return this.fieldOfView;
        }
        getDirection() {
            return this.direction;
        }
        getNear() {
            return this.near;
        }
        getFar() {
            return this.far;
        }
        /**
         * Set the camera to perspective projection. The world origin is in the center of the canvaselement.
         * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
         * @param _fieldOfView The field of view in Degrees. (Default = 45)
         * @param _direction The plane on which the fieldOfView-Angle is given
         */
        projectCentral(_aspect = this.aspectRatio, _fieldOfView = this.fieldOfView, _direction = this.direction, _near = 1, _far = 2000) {
            this.aspectRatio = _aspect;
            this.fieldOfView = _fieldOfView;
            this.direction = _direction;
            this.projection = PROJECTION.CENTRAL;
            this.near = _near;
            this.far = _far;
            this.transform = FudgeCore.Matrix4x4.PROJECTION_CENTRAL(_aspect, this.fieldOfView, _near, _far, this.direction); // TODO: remove magic numbers
        }
        /**
         * Set the camera to orthographic projection. The origin is in the top left corner of the canvas.
         * @param _left The positionvalue of the projectionspace's left border. (Default = 0)
         * @param _right The positionvalue of the projectionspace's right border. (Default = canvas.clientWidth)
         * @param _bottom The positionvalue of the projectionspace's bottom border.(Default = canvas.clientHeight)
         * @param _top The positionvalue of the projectionspace's top border.(Default = 0)
         */
        projectOrthographic(_left = 0, _right = FudgeCore.RenderManager.getCanvas().clientWidth, _bottom = FudgeCore.RenderManager.getCanvas().clientHeight, _top = 0) {
            this.projection = PROJECTION.ORTHOGRAPHIC;
            this.transform = FudgeCore.Matrix4x4.PROJECTION_ORTHOGRAPHIC(_left, _right, _bottom, _top, 400, -400); // TODO: examine magic numbers!
        }
        /**
         * Return the calculated normed dimension of the projection surface, that is in the hypothetical distance of 1 to the camera
         */
        getProjectionRectangle() {
            let tanFov = Math.tan(Math.PI * this.fieldOfView / 360); // Half of the angle, to calculate dimension from the center -> right angle
            let tanHorizontal = 0;
            let tanVertical = 0;
            if (this.direction == FIELD_OF_VIEW.DIAGONAL) {
                let aspect = Math.sqrt(this.aspectRatio);
                tanHorizontal = tanFov * aspect;
                tanVertical = tanFov / aspect;
            }
            else if (this.direction == FIELD_OF_VIEW.VERTICAL) {
                tanVertical = tanFov;
                tanHorizontal = tanVertical * this.aspectRatio;
            }
            else { //FOV_DIRECTION.HORIZONTAL
                tanHorizontal = tanFov;
                tanVertical = tanHorizontal / this.aspectRatio;
            }
            return FudgeCore.Rectangle.GET(0, 0, tanHorizontal * 2, tanVertical * 2);
        }
        project(_pointInWorldSpace) {
            let result;
            result = FudgeCore.Vector3.TRANSFORMATION(_pointInWorldSpace, this.ViewProjectionMatrix);
            let m = this.ViewProjectionMatrix.get();
            let w = m[3] * _pointInWorldSpace.x + m[7] * _pointInWorldSpace.y + m[11] * _pointInWorldSpace.z + m[15];
            result.scale(1 / w);
            return result;
        }
        //#region Transfer
        serialize() {
            let serialization = {
                backgroundColor: this.backgroundColor,
                backgroundEnabled: this.backgroundEnabled,
                projection: this.projection,
                fieldOfView: this.fieldOfView,
                direction: this.direction,
                aspect: this.aspectRatio,
                pivot: this.pivot.serialize(),
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.backgroundColor = _serialization.backgroundColor;
            this.backgroundEnabled = _serialization.backgroundEnabled;
            this.projection = _serialization.projection;
            this.fieldOfView = _serialization.fieldOfView;
            this.aspectRatio = _serialization.aspect;
            this.direction = _serialization.direction;
            this.pivot.deserialize(_serialization.pivot);
            super.deserialize(_serialization[super.constructor.name]);
            switch (this.projection) {
                case PROJECTION.ORTHOGRAPHIC:
                    this.projectOrthographic(); // TODO: serialize and deserialize parameters
                    break;
                case PROJECTION.CENTRAL:
                    this.projectCentral();
                    break;
            }
            return this;
        }
        getMutatorAttributeTypes(_mutator) {
            let types = super.getMutatorAttributeTypes(_mutator);
            if (types.direction)
                types.direction = FIELD_OF_VIEW;
            if (types.projection)
                types.projection = PROJECTION;
            return types;
        }
        async mutate(_mutator) {
            super.mutate(_mutator);
            switch (this.projection) {
                case PROJECTION.CENTRAL:
                    this.projectCentral(this.aspectRatio, this.fieldOfView, this.direction);
                    break;
            }
        }
        reduceMutator(_mutator) {
            delete _mutator.transform;
            super.reduceMutator(_mutator);
        }
    }
    ComponentCamera.iSubclass = FudgeCore.Component.registerSubclass(ComponentCamera);
    FudgeCore.ComponentCamera = ComponentCamera;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Baseclass for different kinds of lights.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Light extends FudgeCore.Mutable {
        constructor(_color = new FudgeCore.Color(1, 1, 1, 1)) {
            super();
            this.color = _color;
        }
        getType() {
            return this.constructor;
        }
        serialize() {
            let serialization = {
                color: this.color.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.color.deserialize(_serialization.color);
            return this;
        }
        reduceMutator() { }
    }
    FudgeCore.Light = Light;
    /**
     * Ambient light, coming from all directions, illuminating everything with its color independent of position and orientation (like a foggy day or in the shades)
     * ```plaintext
     * ~ ~ ~
     *  ~ ~ ~
     * ```
     */
    class LightAmbient extends Light {
        constructor(_color = new FudgeCore.Color(1, 1, 1, 1)) {
            super(_color);
        }
    }
    FudgeCore.LightAmbient = LightAmbient;
    /**
     * Directional light, illuminating everything from a specified direction with its color (like standing in bright sunlight)
     * ```plaintext
     * --->
     * --->
     * --->
     * ```
     */
    class LightDirectional extends Light {
        constructor(_color = new FudgeCore.Color(1, 1, 1, 1)) {
            super(_color);
        }
    }
    FudgeCore.LightDirectional = LightDirectional;
    /**
     * Omnidirectional light emitting from its position, illuminating objects depending on their position and distance with its color (like a colored light bulb)
     * ```plaintext
     *         .\|/.
     *        -- o --
     *         ´/|\`
     * ```
     */
    class LightPoint extends Light {
        constructor() {
            super(...arguments);
            this.range = 10;
        }
    }
    FudgeCore.LightPoint = LightPoint;
    /**
     * Spot light emitting within a specified angle from its position, illuminating objects depending on their position and distance with its color
     * ```plaintext
     *          o
     *         /|\
     *        / | \
     * ```
     */
    class LightSpot extends Light {
    }
    FudgeCore.LightSpot = LightSpot;
})(FudgeCore || (FudgeCore = {}));
///<reference path="../Light/Light.ts"/>
var FudgeCore;
///<reference path="../Light/Light.ts"/>
(function (FudgeCore) {
    /**
     * Attaches a [[Light]] to the node
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    /**
     * Defines identifiers for the various types of light this component can provide.
     */
    // export let LIGHT_TYPE: { [type: string]: string } = {
    let LIGHT_TYPE;
    (function (LIGHT_TYPE) {
        LIGHT_TYPE["AMBIENT"] = "LightAmbient";
        LIGHT_TYPE["DIRECTIONAL"] = "LightDirectional";
        LIGHT_TYPE["POINT"] = "LightPoint";
        LIGHT_TYPE["SPOT"] = "LightSpot";
    })(LIGHT_TYPE = FudgeCore.LIGHT_TYPE || (FudgeCore.LIGHT_TYPE = {}));
    ;
    class ComponentLight extends FudgeCore.Component {
        constructor(_light = new FudgeCore.LightAmbient()) {
            super();
            // private static constructors: { [type: string]: General } = { [LIGHT_TYPE.AMBIENT]: LightAmbient, [LIGHT_TYPE.DIRECTIONAL]: LightDirectional, [LIGHT_TYPE.POINT]: LightPoint, [LIGHT_TYPE.SPOT]: LightSpot };
            this.pivot = FudgeCore.Matrix4x4.IDENTITY();
            this.light = null;
            this.singleton = false;
            this.light = _light;
        }
        setType(_class) {
            let mtrOld = {};
            if (this.light)
                mtrOld = this.light.getMutator();
            this.light = new _class();
            this.light.mutate(mtrOld);
        }
        serialize() {
            let serialization = {
                pivot: this.pivot.serialize(),
                light: FudgeCore.Serializer.serialize(this.light)
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.pivot.deserialize(_serialization.pivot);
            this.light = await FudgeCore.Serializer.deserialize(_serialization.light);
            return this;
        }
        getMutator() {
            let mutator = super.getMutator(true);
            mutator.type = this.light.getType().name;
            return mutator;
        }
        getMutatorAttributeTypes(_mutator) {
            let types = super.getMutatorAttributeTypes(_mutator);
            if (types.type)
                types.type = LIGHT_TYPE;
            return types;
        }
        async mutate(_mutator) {
            let type = _mutator.type;
            if (type != this.light.constructor.name)
                this.setType(FudgeCore.Serializer.getConstructor(type));
            delete (_mutator.type); // exclude light type from further mutation
            super.mutate(_mutator);
            _mutator.type = type; // reconstruct mutator
        }
    }
    ComponentLight.iSubclass = FudgeCore.Component.registerSubclass(ComponentLight);
    FudgeCore.ComponentLight = ComponentLight;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Attaches a [[Material]] to the node
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentMaterial extends FudgeCore.Component {
        // public mutatorCoat: MutatorForComponent;
        constructor(_material = null) {
            super();
            this.clrPrimary = FudgeCore.Color.CSS("white");
            this.clrSecondary = FudgeCore.Color.CSS("white");
            this.pivot = FudgeCore.Matrix3x3.IDENTITY();
            this.material = _material;
            // this.mutatorCoat = _material.getCoat().getMutatorForComponent();
        }
        //#region Transfer
        serialize() {
            let serialization = {
                clrPrimary: this.clrPrimary.serialize(),
                clrSecondary: this.clrSecondary.serialize(),
                pivot: this.pivot.serialize(),
                [super.constructor.name]: super.serialize()
            };
            /* at this point of time, serialization as resource and as inline object is possible. TODO: check if inline becomes obsolete */
            let idMaterial = this.material.idResource;
            // if (idMaterial)
            serialization.idMaterial = idMaterial;
            // else
            //   serialization.material = Serializer.serialize(this.material);
            return serialization;
        }
        async deserialize(_serialization) {
            let material;
            // if (_serialization.idMaterial)
            material = await FudgeCore.Project.getResource(_serialization.idMaterial);
            // else
            //   material = <Material>await Serializer.deserialize(_serialization.material);
            this.material = material;
            this.clrPrimary.deserialize(_serialization.clrPrimary);
            this.clrSecondary.deserialize(_serialization.clrSecondary);
            this.pivot.deserialize(_serialization.pivot);
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
    }
    ComponentMaterial.iSubclass = FudgeCore.Component.registerSubclass(ComponentMaterial);
    FudgeCore.ComponentMaterial = ComponentMaterial;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Attaches a [[Mesh]] to the node
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentMesh extends FudgeCore.Component {
        constructor(_mesh = null) {
            super();
            this.pivot = FudgeCore.Matrix4x4.IDENTITY();
            this.mesh = null;
            this.mesh = _mesh;
        }
        //#region Transfer
        serialize() {
            let serialization;
            /* at this point of time, serialization as resource and as inline object is possible. TODO: check if inline becomes obsolete */
            let idMesh = this.mesh.idResource;
            if (idMesh)
                serialization = { idMesh: idMesh };
            else
                serialization = { mesh: FudgeCore.Serializer.serialize(this.mesh) };
            serialization.pivot = this.pivot.serialize();
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            let mesh;
            if (_serialization.idMesh)
                mesh = await FudgeCore.Project.getResource(_serialization.idMesh);
            else
                mesh = await FudgeCore.Serializer.deserialize(_serialization.mesh);
            this.mesh = mesh;
            this.pivot.deserialize(_serialization.pivot);
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        getMutatorForUserInterface() {
            let mutator = this.getMutator();
            // if (!this.mesh)
            //   mutator.mesh = Mesh;
            return mutator;
        }
    }
    ComponentMesh.iSubclass = FudgeCore.Component.registerSubclass(ComponentMesh);
    FudgeCore.ComponentMesh = ComponentMesh;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Base class for scripts the user writes
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/JirkaDellOro/FUDGE/wiki/Component
     */
    class ComponentScript extends FudgeCore.Component {
        constructor() {
            super();
            this.singleton = false;
        }
        serialize() {
            return this.getMutator();
        }
        async deserialize(_serialization) {
            this.mutate(_serialization);
            return this;
        }
    }
    // registering this doesn't make sense, only its subclasses. Or this component must refer to scripts to be attached to this component
    // TODO: rethink & refactor
    ComponentScript.iSubclass = FudgeCore.Component.registerSubclass(ComponentScript);
    FudgeCore.ComponentScript = ComponentScript;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let BASE;
    (function (BASE) {
        BASE[BASE["SELF"] = 0] = "SELF";
        BASE[BASE["PARENT"] = 1] = "PARENT";
        BASE[BASE["WORLD"] = 2] = "WORLD";
        BASE[BASE["NODE"] = 3] = "NODE";
    })(BASE = FudgeCore.BASE || (FudgeCore.BASE = {}));
    /**
     * Attaches a transform-[[Matrix4x4]] to the node, moving, scaling and rotating it in space relative to its parent.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ComponentTransform extends FudgeCore.Component {
        constructor(_matrix = FudgeCore.Matrix4x4.IDENTITY()) {
            super();
            this.local = _matrix;
        }
        //#region Transformations respecting the hierarchy
        /**
         * Adjusts the rotation to point the z-axis directly at the given target point in world space and tilts it to accord with the given up vector,
         * respectively calculating yaw and pitch. If no up vector is given, the previous up-vector is used.
         */
        lookAt(_targetWorld, _up) {
            let container = this.getContainer();
            if (!container && !container.getParent())
                return this.local.lookAt(_targetWorld, _up);
            // component is attached to a child node -> transform respecting the hierarchy
            let mtxWorld = container.mtxWorld.copy;
            mtxWorld.lookAt(_targetWorld, _up, true);
            let local = FudgeCore.Matrix4x4.RELATIVE(mtxWorld, null, container.getParent().mtxWorldInverse);
            this.local = local;
        }
        /**
         * Adjusts the rotation to match its y-axis with the given up-vector and facing its z-axis toward the given target at minimal angle,
         * respectively calculating yaw only. If no up vector is given, the previous up-vector is used.
         */
        showTo(_targetWorld, _up) {
            let container = this.getContainer();
            if (!container && !container.getParent())
                return this.local.showTo(_targetWorld, _up);
            // component is attached to a child node -> transform respecting the hierarchy
            let mtxWorld = container.mtxWorld.copy;
            mtxWorld.showTo(_targetWorld, _up, true);
            let local = FudgeCore.Matrix4x4.RELATIVE(mtxWorld, null, container.getParent().mtxWorldInverse);
            this.local = local;
        }
        /**
         * recalculates this local matrix to yield the identical world matrix based on the given node.
         * Use rebase before appending the container of this component to another node while preserving its transformation in the world.
         */
        rebase(_node = null) {
            let mtxResult = this.local;
            let container = this.getContainer();
            if (container)
                mtxResult = container.mtxWorld;
            if (_node)
                mtxResult = FudgeCore.Matrix4x4.RELATIVE(mtxResult, null, _node.mtxWorldInverse);
            this.local = mtxResult;
        }
        /**
         * Applies the given transformation relative to the selected base (SELF, PARENT, WORLD) or a particular other node (NODE)
         */
        transform(_transform, _base = BASE.SELF, _node = null) {
            switch (_base) {
                case BASE.SELF:
                    this.local.multiply(_transform);
                    break;
                case BASE.PARENT:
                    this.local.multiply(_transform, true);
                    break;
                case BASE.NODE:
                    if (!_node)
                        throw new Error("BASE.NODE requires a node given as base");
                case BASE.WORLD:
                    this.rebase(_node);
                    this.local.multiply(_transform, true);
                    let container = this.getContainer();
                    if (container) {
                        if (_base == BASE.NODE)
                            // fix mtxWorld of container for subsequent rebasing 
                            container.mtxWorld.set(FudgeCore.Matrix4x4.MULTIPLICATION(_node.mtxWorld, container.mtxLocal));
                        let parent = container.getParent();
                        if (parent) {
                            // fix mtxLocal for current parent
                            this.rebase(container.getParent());
                            container.mtxWorld.set(FudgeCore.Matrix4x4.MULTIPLICATION(container.getParent().mtxWorld, container.mtxLocal));
                        }
                    }
                    break;
            }
        }
        //#endregion
        //#region Transfer
        serialize() {
            let serialization = {
                local: this.local.serialize(),
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.deserialize(_serialization[super.constructor.name]);
            this.local.deserialize(_serialization.local);
            return this;
        }
        // public mutate(_mutator: Mutator): void {
        //     this.local.mutate(_mutator);
        // }
        // public getMutator(): Mutator { 
        //     return this.local.getMutator();
        // }
        // public getMutatorAttributeTypes(_mutator: Mutator): MutatorAttributeTypes {
        //     let types: MutatorAttributeTypes = this.local.getMutatorAttributeTypes(_mutator);
        //     return types;
        // }
        reduceMutator(_mutator) {
            delete _mutator.world;
            super.reduceMutator(_mutator);
        }
    }
    ComponentTransform.iSubclass = FudgeCore.Component.registerSubclass(ComponentTransform);
    FudgeCore.ComponentTransform = ComponentTransform;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Processes input signals of type number and generates an output signal of the same type using
     * proportional, integral or differential mapping, an amplification factor and a linear dampening/delay
     * ```plaintext
     *          ┌─────────────────────────────────────────────────────────────┐
     *          │   ┌───────┐   ┌─────┐      pass through (Proportional)      │
     *  Input → │ → │amplify│ → │delay│ → ⚟ sum up over time (Integral) ⚞ → │ → Output
     *          │   └───────┘   └─────┘      pass change  (Differential)      │
     *          └─────────────────────────────────────────────────────────────┘
     * ```
     */
    class Control extends EventTarget {
        constructor(_name, _factor = 1, _type = 0 /* PROPORTIONAL */, _active = true) {
            super();
            this.rateDispatchOutput = 0;
            this.valuePrevious = 0;
            this.outputBase = 0;
            this.outputTarget = 0;
            this.outputPrevious = 0;
            this.outputTargetPrevious = 0;
            this.factor = 0;
            this.time = FudgeCore.Time.game;
            this.timeValueDelay = 0;
            this.timeOutputTargetSet = 0;
            this.idTimer = undefined;
            this.dispatchOutput = (_eventOrValue) => {
                if (!this.active)
                    return;
                let timer = this.time.getTimer(this.idTimer);
                let output;
                if (typeof (_eventOrValue) == "number")
                    output = _eventOrValue;
                else
                    output = this.calculateOutput();
                let outputChanged = (output != this.outputPrevious);
                if (timer) {
                    timer.active = outputChanged;
                    if (!outputChanged)
                        return;
                }
                this.outputPrevious = output;
                let event = new CustomEvent("output" /* OUTPUT */, {
                    detail: {
                        output: output
                    }
                });
                this.dispatchEvent(event);
            };
            this.factor = _factor;
            this.type = _type;
            this.active = _active;
            this.name = _name;
        }
        /**
         * Set the time-object to be used when calculating the output in [[CONTROL_TYPE.INTEGRAL]]
         */
        setTimebase(_time) {
            this.time = _time;
            this.calculateOutput();
        }
        /**
         * Feed an input value into this control and fire the events [[EVENT_CONTROL.INPUT]] and [[EVENT_CONTROL.OUTPUT]]
         */
        setInput(_input) {
            if (!this.active)
                return;
            this.outputBase = this.calculateOutput();
            this.valuePrevious = this.getValueDelayed();
            this.outputTarget = this.factor * _input;
            this.timeOutputTargetSet = this.time.get();
            if (this.type == 2 /* DIFFERENTIAL */) {
                this.valuePrevious = this.outputTarget - this.outputTargetPrevious;
                this.outputTargetPrevious = this.outputTarget;
                this.outputTarget = 0;
            }
            this.dispatchEvent(new Event("input" /* INPUT */));
            if (this.type == 2 /* DIFFERENTIAL */)
                this.dispatchOutput(this.valuePrevious);
            else
                this.dispatchOutput(null);
        }
        pulse(_input) {
            this.setInput(_input);
            this.setInput(0);
        }
        /**
         * Set the time to take for the internal linear dampening until the final ouput value is reached
         */
        setDelay(_time) {
            this.timeValueDelay = Math.max(0, _time);
        }
        /**
         * Set the number of output-events to dispatch per second.
         * At the default of 0, the control output must be polled and will only actively dispatched once each time input occurs and the output changes.
         */
        setRateDispatchOutput(_rateDispatchOutput = 0) {
            this.rateDispatchOutput = _rateDispatchOutput;
            this.time.deleteTimer(this.idTimer);
            this.idTimer = undefined;
            if (this.rateDispatchOutput)
                this.idTimer = this.time.setTimer(1000 / this.rateDispatchOutput, 0, this.dispatchOutput);
        }
        /**
         * Set the factor to multiply the input value given with [[setInput]] with
         */
        setFactor(_factor) {
            this.factor = _factor;
        }
        /**
         * Get the value from the output of this control
         */
        getOutput() {
            return this.calculateOutput();
        }
        /**
         * Calculates the output of this control
         */
        calculateOutput() {
            let output = 0;
            let value = this.getValueDelayed();
            switch (this.type) {
                case 1 /* INTEGRAL */:
                    let timeCurrent = this.time.get();
                    let timeElapsedSinceInput = timeCurrent - this.timeOutputTargetSet;
                    output = this.outputBase;
                    if (this.timeValueDelay > 0) {
                        if (timeElapsedSinceInput < this.timeValueDelay) {
                            output += 0.5 * (this.valuePrevious + value) * timeElapsedSinceInput;
                            break;
                        }
                        else {
                            output += 0.5 * (this.valuePrevious + value) * this.timeValueDelay;
                            timeElapsedSinceInput -= this.timeValueDelay;
                        }
                    }
                    output += value * timeElapsedSinceInput;
                    // value += 0.5 * (this.inputPrevious - input) * this.timeInputDelay + input * timeElapsedSinceInput;
                    break;
                case 2 /* DIFFERENTIAL */:
                case 0 /* PROPORTIONAL */:
                default:
                    output = value;
                    break;
            }
            return output;
        }
        getValueDelayed() {
            if (this.timeValueDelay > 0) {
                let timeElapsedSinceInput = this.time.get() - this.timeOutputTargetSet;
                if (timeElapsedSinceInput < this.timeValueDelay)
                    return this.valuePrevious + (this.outputTarget - this.valuePrevious) * timeElapsedSinceInput / this.timeValueDelay;
            }
            return this.outputTarget;
        }
    }
    FudgeCore.Control = Control;
})(FudgeCore || (FudgeCore = {}));
///<reference path="Control.ts"/>
var FudgeCore;
///<reference path="Control.ts"/>
(function (FudgeCore) {
    /**
     * Handles multiple controls as inputs and creates an output from that.
     * As a subclass of [[Control]], axis calculates the ouput summing up the inputs and processing the result using its own settings.
     * Dispatches [[EVENT_CONTROL.OUTPUT]] and [[EVENT_CONTROL.INPUT]] when one of the controls dispatches them.
     * ```plaintext
     *           ┌───────────────────────────────────────────┐
     *           │ ┌───────┐                                 │
     *   Input → │ │control│\                                │
     *           │ └───────┘ \                               │
     *           │ ┌───────┐  \┌───┐   ┌─────────────────┐   │
     *   Input → │ │control│---│sum│ → │internal control │ → │ → Output
     *           │ └───────┘  /└───┘   └─────────────────┘   │
     *           │ ┌───────┐ /                               │
     *   Input → │ │control│/                                │
     *           │ └───────┘                                 │
     *           └───────────────────────────────────────────┘
     * ```
     */
    class Axis extends FudgeCore.Control {
        constructor() {
            super(...arguments);
            this.controls = new Map();
            this.sumPrevious = 0;
            this.hndOutputEvent = (_event) => {
                if (!this.active)
                    return;
                let control = _event.target;
                let event = new CustomEvent("output" /* OUTPUT */, { detail: {
                        control: control,
                        input: _event.detail.output,
                        output: this.getOutput()
                    } });
                this.dispatchEvent(event);
            };
            this.hndInputEvent = (_event) => {
                if (!this.active)
                    return;
                let event = new Event("input" /* INPUT */, _event);
                this.dispatchEvent(event);
            };
        }
        /**
         * Add the control given to the list of controls feeding into this axis
         */
        addControl(_control) {
            this.controls.set(_control.name, _control);
            _control.addEventListener("input" /* INPUT */, this.hndInputEvent);
            _control.addEventListener("output" /* OUTPUT */, this.hndOutputEvent);
        }
        /**
         * Returns the control with the given name
         */
        getControl(_name) {
            return this.controls.get(_name);
        }
        /**
         * Removes the control with the given name
         */
        removeControl(_name) {
            let control = this.getControl(_name);
            if (control) {
                control.removeEventListener("input" /* INPUT */, this.hndInputEvent);
                control.removeEventListener("output" /* OUTPUT */, this.hndOutputEvent);
                this.controls.delete(_name);
            }
        }
        /**
         * Returns the value of this axis after summing up all inputs and processing the sum according to the axis' settings
         */
        getOutput() {
            let sumInput = 0;
            for (let control of this.controls) {
                if (control[1].active)
                    sumInput += control[1].getOutput();
            }
            if (sumInput != this.sumPrevious)
                super.setInput(sumInput);
            this.sumPrevious = sumInput;
            return super.getOutput();
        }
    }
    FudgeCore.Axis = Axis;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Collects the keys pressed on the keyboard and stores their status.
     */
    class Keyboard {
        /**
         * Returns true if one of the given keys is is currently being pressed.
         */
        static isPressedOne(_keys) {
            for (let code of _keys) {
                if (Keyboard.keysPressed[code])
                    return true;
            }
            return false;
        }
        /**
         * Returns true if all of the given keys are currently being pressed
         */
        static isPressedCombo(_keys) {
            for (let code of _keys) {
                if (!Keyboard.keysPressed[code])
                    return false;
            }
            return true;
        }
        /**
         * Returns the value given as _active if one or, when _combo is true, all of the given keys are pressed.
         * Returns the value given as _inactive if not.
         */
        static mapToValue(_active, _inactive, _keys, _combo = false) {
            if (!_combo && Keyboard.isPressedOne(_keys))
                return _active;
            if (Keyboard.isPressedCombo(_keys))
                return _active;
            return _inactive;
        }
        static initialize() {
            let store = {};
            document.addEventListener("keydown", Keyboard.hndKeyInteraction);
            document.addEventListener("keyup", Keyboard.hndKeyInteraction);
            return store;
        }
        static hndKeyInteraction(_event) {
            Keyboard.keysPressed[_event.code] = (_event.type == "keydown");
        }
    }
    Keyboard.keysPressed = Keyboard.initialize();
    FudgeCore.Keyboard = Keyboard;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="DebugTarget.ts"/>
var FudgeCore;
// / <reference path="DebugTarget.ts"/>
(function (FudgeCore) {
    /**
     * Routing to the alert box
     */
    class DebugAlert extends FudgeCore.DebugTarget {
        static createDelegate(_headline) {
            let delegate = function (_message, ..._args) {
                let args = _args.map(_arg => _arg.toString());
                let out = _headline + " " + FudgeCore.DebugTarget.mergeArguments(_message, args);
                alert(out);
            };
            return delegate;
        }
    }
    DebugAlert.delegates = {
        [FudgeCore.DEBUG_FILTER.INFO]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.INFO]),
        [FudgeCore.DEBUG_FILTER.LOG]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.LOG]),
        [FudgeCore.DEBUG_FILTER.WARN]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.WARN]),
        [FudgeCore.DEBUG_FILTER.ERROR]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.ERROR]),
        [FudgeCore.DEBUG_FILTER.FUDGE]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.FUDGE])
    };
    FudgeCore.DebugAlert = DebugAlert;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="DebugTarget.ts"/>
var FudgeCore;
// / <reference path="DebugTarget.ts"/>
(function (FudgeCore) {
    /**
     * Routing to a HTMLDialogElement
     */
    class DebugDialog extends FudgeCore.DebugTarget {
    }
    FudgeCore.DebugDialog = DebugDialog;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="DebugTarget.ts"/>
var FudgeCore;
// / <reference path="DebugTarget.ts"/>
(function (FudgeCore) {
    /**
     * Route to an HTMLTextArea, may be obsolete when using HTMLDialogElement
     */
    class DebugTextArea extends FudgeCore.DebugTarget {
        static clear() {
            DebugTextArea.textArea.textContent = "";
            DebugTextArea.groups = [];
        }
        static group(_name) {
            DebugTextArea.print("▼ " + _name);
            DebugTextArea.groups.push(_name);
        }
        static groupEnd() {
            DebugTextArea.groups.pop();
        }
        static createDelegate(_headline) {
            let delegate = function (_message, ..._args) {
                DebugTextArea.print(_headline + " " + FudgeCore.DebugTarget.mergeArguments(_message, _args));
            };
            return delegate;
        }
        static getIndentation(_level) {
            let result = "";
            for (let i = 0; i < _level; i++)
                result += "| ";
            return result;
        }
        static print(_text) {
            DebugTextArea.textArea.textContent += DebugTextArea.getIndentation(DebugTextArea.groups.length) + _text + "\n";
            if (DebugTextArea.autoScroll)
                DebugTextArea.textArea.scrollTop = DebugTextArea.textArea.scrollHeight;
        }
    }
    DebugTextArea.textArea = document.createElement("textarea");
    DebugTextArea.autoScroll = true;
    DebugTextArea.delegates = {
        [FudgeCore.DEBUG_FILTER.INFO]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.INFO]),
        [FudgeCore.DEBUG_FILTER.LOG]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.LOG]),
        [FudgeCore.DEBUG_FILTER.WARN]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.WARN]),
        [FudgeCore.DEBUG_FILTER.ERROR]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.ERROR]),
        [FudgeCore.DEBUG_FILTER.FUDGE]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.FUDGE]),
        [FudgeCore.DEBUG_FILTER.CLEAR]: DebugTextArea.clear,
        [FudgeCore.DEBUG_FILTER.GROUP]: DebugTextArea.group,
        [FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED]: DebugTextArea.group,
        [FudgeCore.DEBUG_FILTER.GROUPEND]: DebugTextArea.groupEnd
    };
    DebugTextArea.groups = [];
    FudgeCore.DebugTextArea = DebugTextArea;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Defines a color as values in the range of 0 to 1 for the four channels red, green, blue and alpha (for opacity)
     */
    class Color extends FudgeCore.Mutable {
        constructor(_r = 1, _g = 1, _b = 1, _a = 1) {
            super();
            this.setNormRGBA(_r, _g, _b, _a);
        }
        static getHexFromCSSKeyword(_keyword) {
            Color.crc2.fillStyle = _keyword;
            return Color.crc2.fillStyle;
        }
        static CSS(_keyword, _alpha = 1) {
            let hex = Color.getHexFromCSSKeyword(_keyword);
            let color = new Color(parseInt(hex.substr(1, 2), 16) / 255, parseInt(hex.substr(3, 2), 16) / 255, parseInt(hex.substr(5, 2), 16) / 255, _alpha);
            return color;
        }
        static MULTIPLY(_color1, _color2) {
            return new Color(_color1.r * _color2.r, _color1.g * _color2.g, _color1.b * _color2.b, _color1.a * _color2.a);
        }
        setNormRGBA(_r, _g, _b, _a) {
            this.r = Math.min(1, Math.max(0, _r));
            this.g = Math.min(1, Math.max(0, _g));
            this.b = Math.min(1, Math.max(0, _b));
            this.a = Math.min(1, Math.max(0, _a));
        }
        setBytesRGBA(_r, _g, _b, _a) {
            this.setNormRGBA(_r / 255, _g / 255, _b / 255, _a / 255);
        }
        getArray() {
            return new Float32Array([this.r, this.g, this.b, this.a]);
        }
        setArrayNormRGBA(_color) {
            this.setNormRGBA(_color[0], _color[1], _color[2], _color[3]);
        }
        setArrayBytesRGBA(_color) {
            this.setBytesRGBA(_color[0], _color[1], _color[2], _color[3]);
        }
        getArrayBytesRGBA() {
            return new Uint8ClampedArray([this.r * 255, this.g * 255, this.b * 255, this.a * 255]);
        }
        add(_color) {
            this.r += _color.r;
            this.g += _color.g;
            this.b += _color.b;
            this.a += _color.a;
        }
        getCSS() {
            let bytes = this.getArrayBytesRGBA();
            return `RGBA(${bytes[0]}, ${bytes[1]}, ${bytes[2]}, ${bytes[3]})`;
        }
        getHex() {
            let bytes = this.getArrayBytesRGBA();
            let hex = "";
            for (let byte of bytes)
                hex += byte.toString(16).padStart(2, "0");
            return hex;
        }
        setHex(_hex) {
            let bytes = this.getArrayBytesRGBA();
            let channel = 0;
            for (let byte in bytes)
                bytes[byte] = parseInt(_hex.substr(channel++ * 2, 2), 16);
            this.setArrayBytesRGBA(bytes);
        }
        //#region Transfer
        serialize() {
            let serialization = this.getMutator(true);
            // serialization.toJSON = () => { return `{ "r": ${this.r}, "g": ${this.g}, "b": ${this.b}, "a": ${this.a}}`; };
            serialization.toJSON = () => { return `[${this.r}, ${this.g}, ${this.b}, ${this.a}]`; };
            return serialization;
        }
        async deserialize(_serialization) {
            if (typeof (_serialization) == "string") {
                [this.r, this.g, this.b, this.a] = JSON.parse(_serialization);
            }
            else
                this.mutate(_serialization);
            return this;
        }
        reduceMutator(_mutator) { }
    }
    // crc2 only used for converting colors from strings predefined by CSS
    Color.crc2 = document.createElement("canvas").getContext("2d");
    FudgeCore.Color = Color;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Baseclass for materials. Combines a [[Shader]] with a compatible [[Coat]]
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Material extends FudgeCore.Mutable {
        constructor(_name, _shader, _coat) {
            super();
            this.idResource = undefined;
            this.name = _name;
            this.shaderType = _shader;
            if (_shader) {
                if (_coat)
                    this.setCoat(_coat);
                else
                    this.setCoat(this.createCoatMatchingShader());
            }
            FudgeCore.Project.register(this);
        }
        /**
         * Creates a new [[Coat]] instance that is valid for the [[Shader]] referenced by this material
         */
        createCoatMatchingShader() {
            let coat = new (this.shaderType.getCoat())();
            return coat;
        }
        /**
         * Makes this material reference the given [[Coat]] if it is compatible with the referenced [[Shader]]
         * @param _coat
         */
        setCoat(_coat) {
            if (_coat.constructor != this.shaderType.getCoat())
                if (_coat instanceof this.shaderType.getCoat())
                    FudgeCore.Debug.fudge("Coat is extension of Coat required by shader");
                else
                    throw (new Error("Shader and coat don't match"));
            this.coat = _coat;
        }
        /**
         * Returns the currently referenced [[Coat]] instance
         */
        getCoat() {
            return this.coat;
        }
        /**
         * Changes the materials reference to the given [[Shader]], creates and references a new [[Coat]] instance
         * and mutates the new coat to preserve matching properties.
         * @param _shaderType
         */
        setShader(_shaderType) {
            this.shaderType = _shaderType;
            let coat = this.createCoatMatchingShader();
            coat.mutate(this.coat.getMutator());
            this.setCoat(coat);
        }
        /**
         * Returns the [[Shader]] referenced by this material
         */
        getShader() {
            return this.shaderType;
        }
        //#region Transfer
        // TODO: this type of serialization was implemented for implicit Material create. Check if obsolete when only one material class exists and/or materials are stored separately
        serialize() {
            let serialization = {
                name: this.name,
                idResource: this.idResource,
                shader: this.shaderType.name,
                coat: FudgeCore.Serializer.serialize(this.coat)
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.name = _serialization.name;
            FudgeCore.Project.register(this, _serialization.idResource);
            // this.idResource = _serialization.idResource;
            // TODO: provide for shaders in the users namespace. See Serializer fullpath etc.
            // tslint:disable-next-line: no-any
            this.shaderType = FudgeCore[_serialization.shader];
            let coat = await FudgeCore.Serializer.deserialize(_serialization.coat);
            this.setCoat(coat);
            return this;
        }
        reduceMutator(_mutator) {
            // delete _mutator.idResource;
        }
    }
    FudgeCore.Material = Material;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let MODE;
    (function (MODE) {
        MODE[MODE["EDITOR"] = 0] = "EDITOR";
        MODE[MODE["RUNTIME"] = 1] = "RUNTIME";
    })(MODE = FudgeCore.MODE || (FudgeCore.MODE = {}));
    /**
     * Static class handling the resources used with the current FUDGE-instance.
     * Keeps a list of the resources and generates ids to retrieve them.
     * Resources are objects referenced multiple times but supposed to be stored only once
     */
    class Project {
        /**
         * Registers the resource and generates an id for it by default.
         * If the resource already has an id, thus having been registered, its deleted from the list and registered anew.
         * It's possible to pass an id, but should not be done except by the Serializer.
         */
        static register(_resource, _idResource) {
            if (_resource.idResource)
                if (_resource.idResource == _idResource)
                    return;
                else
                    this.deregister(_resource);
            _resource.idResource = _idResource || Project.generateId(_resource);
            Project.resources[_resource.idResource] = _resource;
        }
        static deregister(_resource) {
            delete (Project.resources[_resource.idResource]);
            delete (Project.serialization[_resource.idResource]);
        }
        static clear() {
            Project.resources = {};
            Project.serialization = {};
            Project.scriptNamespaces = {};
        }
        // <T extends Component>(_class: new () => T): T[] {
        //   return <T[]>(this.components[_class.name] || []).slice(0);
        // }
        static getResourcesOfType(_type) {
            let found = {};
            for (let resourceId in Project.resources) {
                let resource = Project.resources[resourceId];
                if (resource instanceof _type)
                    found[resourceId] = resource;
            }
            return found;
        }
        /**
         * Generate a user readable and unique id using the type of the resource, the date and random numbers
         * @param _resource
         */
        static generateId(_resource) {
            // TODO: build id and integrate info from resource, not just date
            let idResource;
            do
                idResource = _resource.constructor.name + "|" + new Date().toISOString() + "|" + Math.random().toPrecision(5).substr(2, 5);
            while (Project.resources[idResource]);
            return idResource;
        }
        /**
         * Tests, if an object is a [[SerializableResource]]
         * @param _object The object to examine
         */
        static isResource(_object) {
            return (Reflect.has(_object, "idResource"));
        }
        /**
         * Retrieves the resource stored with the given id
         */
        static async getResource(_idResource) {
            let resource = Project.resources[_idResource];
            if (!resource) {
                let serialization = Project.serialization[_idResource];
                if (!serialization) {
                    FudgeCore.Debug.error("Resource not found", _idResource);
                    return null;
                }
                resource = await Project.deserializeResource(serialization);
            }
            return resource;
        }
        /**
         * Creates and registers a resource from a [[Node]], copying the complete graph starting with it
         * @param _node A node to create the resource from
         * @param _replaceWithInstance if true (default), the node used as origin is replaced by a [[GraphInstance]] of the [[Graph]] created
         */
        static async registerAsGraph(_node, _replaceWithInstance = true) {
            let serialization = _node.serialize();
            let graph = new FudgeCore.Graph(_node.name);
            await graph.deserialize(serialization);
            Project.register(graph);
            if (_replaceWithInstance && _node.getParent()) {
                let instance = new FudgeCore.GraphInstance(graph);
                _node.getParent().replaceChild(_node, instance);
            }
            return graph;
        }
        static async createGraphInstance(_graph) {
            let instance = new FudgeCore.GraphInstance(null); // TODO: cleanup since creation moved here
            await instance.set(_graph);
            return instance;
        }
        static registerScriptNamespace(_namespace) {
            let name = FudgeCore.Serializer.registerNamespace(_namespace);
            if (!Project.scriptNamespaces[name])
                Project.scriptNamespaces[name] = _namespace;
        }
        static getComponentScripts() {
            let compoments = {};
            for (let namespace in Project.scriptNamespaces) {
                compoments[namespace] = [];
                for (let name in Project.scriptNamespaces[namespace]) {
                    let script = Reflect.get(Project.scriptNamespaces[namespace], name);
                    // is script a subclass of ComponentScript? instanceof doesn't work, since no instance is created
                    // let superclass: Object = script;
                    // while (superclass) {
                    //   superclass = Reflect.getPrototypeOf(superclass);
                    //   if (superclass == ComponentScript) {
                    //     scripts.push(script);
                    //     break;
                    //   }
                    // }
                    // Using Object.create doesn't call the constructor, but instanceof can be used. More elegant than the loop above, though maybe not as performant. 
                    let o = Object.create(script);
                    if (o.prototype instanceof FudgeCore.ComponentScript)
                        compoments[namespace].push(script);
                }
            }
            return compoments;
        }
        static async loadScript(_url) {
            let script = document.createElement("script");
            script.type = "text/javascript";
            // script.type = "module";
            script.async = false;
            // script.addEventListener("load", handleLoadedScript)
            let head = document.head;
            head.appendChild(script);
            console.log("Loading: ", _url);
            return new Promise((resolve, reject) => {
                script.addEventListener("load", () => resolve());
                script.addEventListener("error", () => {
                    FudgeCore.Debug.error("Loading script", _url);
                    reject();
                });
                script.src = _url.toString();
            });
        }
        static async loadResources(_url) {
            const response = await fetch(_url);
            const resourceFileContent = await response.text();
            let serialization = FudgeCore.Serializer.parse(resourceFileContent);
            let reconstruction = await Project.deserialize(serialization);
            return reconstruction;
        }
        static async loadResourcesFromHTML() {
            const head = document.head;
            let links = head.querySelectorAll("link[type=resources");
            for (let link of links) {
                let url = link.getAttribute("src");
                await Project.loadResources(url);
            }
        }
        /**
         * Serialize all resources
         */
        static serialize() {
            let serialization = {};
            for (let idResource in Project.resources) {
                let resource = Project.resources[idResource];
                if (idResource != resource.idResource)
                    FudgeCore.Debug.error("Resource-id mismatch", resource);
                serialization[idResource] = FudgeCore.Serializer.serialize(resource);
            }
            return serialization;
        }
        /**
         * Create resources from a serialization, deleting all resources previously registered
         * @param _serialization
         */
        static async deserialize(_serialization) {
            Project.serialization = _serialization;
            Project.resources = {};
            for (let idResource in _serialization) {
                let serialization = _serialization[idResource];
                let resource = await Project.deserializeResource(serialization);
                if (resource)
                    Project.resources[idResource] = resource;
            }
            return Project.resources;
        }
        static async deserializeResource(_serialization) {
            return FudgeCore.Serializer.deserialize(_serialization);
        }
    }
    Project.resources = {};
    Project.serialization = {};
    Project.scriptNamespaces = {};
    Project.baseURL = new URL(location.toString());
    Project.mode = MODE.RUNTIME;
    FudgeCore.Project = Project;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Controls the rendering of a graph, using the given [[ComponentCamera]],
     * and the propagation of the rendered image from the offscreen renderbuffer to the target canvas
     * through a series of [[Framing]] objects. The stages involved are in order of rendering
     * [[RenderManager]].viewport -> [[Viewport]].source -> [[Viewport]].destination -> DOM-Canvas -> Client(CSS)
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Viewport extends FudgeCore.EventTargetƒ {
        constructor() {
            super(...arguments);
            this.name = "Viewport"; // The name to call this viewport by.
            this.camera = null; // The camera representing the view parameters to render the graph.
            // TODO: verify if client to canvas should be in Viewport or somewhere else (Window, Container?)
            // Multiple viewports using the same canvas shouldn't differ here...
            // different framing methods can be used, this is the default
            this.frameClientToCanvas = new FudgeCore.FramingScaled();
            this.frameCanvasToDestination = new FudgeCore.FramingComplex();
            this.frameDestinationToSource = new FudgeCore.FramingScaled();
            this.frameSourceToRender = new FudgeCore.FramingScaled();
            this.adjustingFrames = true;
            this.adjustingCamera = true;
            this.graph = null; // The first node in the graph that will be rendered.
            this.crc2 = null;
            this.canvas = null;
            this.pickBuffers = [];
            /**
             * Handle drag-drop events and dispatch to viewport as FUDGE-Event
             */
            this.hndDragDropEvent = (_event) => {
                let _dragevent = _event;
                switch (_dragevent.type) {
                    case "dragover":
                    case "drop":
                        _dragevent.preventDefault();
                        _dragevent.dataTransfer.effectAllowed = "none";
                        break;
                    case "dragstart":
                        // just dummy data,  valid data should be set in handler registered by the user
                        _dragevent.dataTransfer.setData("text", "Hallo");
                        // TODO: check if there is a better solution to hide the ghost image of the draggable object
                        _dragevent.dataTransfer.setDragImage(new Image(), 0, 0);
                        break;
                }
                let event = new FudgeCore.EventDragDrop("ƒ" + _event.type, _dragevent);
                this.addCanvasPosition(event);
                this.dispatchEvent(event);
            };
            /**
             * Handle pointer events and dispatch to viewport as FUDGE-Event
             */
            this.hndPointerEvent = (_event) => {
                let event = new FudgeCore.EventPointer("ƒ" + _event.type, _event);
                this.addCanvasPosition(event);
                this.dispatchEvent(event);
            };
            /**
             * Handle keyboard events and dispatch to viewport as FUDGE-Event, if the viewport has the focus
             */
            this.hndKeyboardEvent = (_event) => {
                if (!this.hasFocus)
                    return;
                let event = new FudgeCore.EventKeyboard("ƒ" + _event.type, _event);
                this.dispatchEvent(event);
            };
            /**
             * Handle wheel event and dispatch to viewport as FUDGE-Event
             */
            this.hndWheelEvent = (_event) => {
                let event = new FudgeCore.EventWheel("ƒ" + _event.type, _event);
                this.dispatchEvent(event);
            };
            // #endregion
        }
        //#endregion
        // #region Events (passing from canvas to viewport and from there into graph)
        /**
         * Returns true if this viewport currently has focus and thus receives keyboard events
         */
        get hasFocus() {
            return (Viewport.focus == this);
        }
        /**
         * Connects the viewport to the given canvas to render the given graph to using the given camera-component, and names the viewport as given.
         */
        initialize(_name, _graph, _camera, _canvas) {
            this.name = _name;
            this.camera = _camera;
            this.canvas = _canvas;
            this.crc2 = _canvas.getContext("2d");
            this.rectSource = FudgeCore.RenderManager.getCanvasRect();
            this.rectDestination = this.getClientRectangle();
            this.setGraph(_graph);
        }
        /**
         * Retrieve the destination canvas
         */
        getCanvas() {
            return this.canvas;
        }
        /**
         * Retrieve the 2D-context attached to the destination canvas
         */
        getContext() {
            return this.crc2;
        }
        /**
         * Retrieve the size of the destination canvas as a rectangle, x and y are always 0
         */
        getCanvasRectangle() {
            return FudgeCore.Rectangle.GET(0, 0, this.canvas.width, this.canvas.height);
        }
        /**
         * Retrieve the client rectangle the canvas is displayed and fit in, x and y are always 0
         */
        getClientRectangle() {
            // FUDGE doesn't care about where the client rect is, only about the size matters.
            // return Rectangle.GET(this.canvas.offsetLeft, this.canvas.offsetTop, this.canvas.clientWidth, this.canvas.clientHeight);
            return FudgeCore.Rectangle.GET(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }
        /**
         * Set the graph to be drawn in the viewport.
         */
        setGraph(_graph) {
            if (this.graph) {
                this.graph.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentEvent);
                this.graph.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndComponentEvent);
            }
            this.graph = _graph;
            if (this.graph) {
                this.graph.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentEvent);
                this.graph.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndComponentEvent);
            }
        }
        getGraph() {
            return this.graph;
        }
        /**
         * Logs this viewports scenegraph to the console.
         */
        showSceneGraph() {
            // TODO: move to debug-class
            let output = "SceneGraph for this viewport:";
            output += "\n \n";
            output += this.graph.name;
            FudgeCore.Debug.log(output + "   => ROOTNODE" + this.graph.toHierarchyString());
        }
        // #region Drawing
        /**
         * Draw this viewport
         */
        draw() {
            FudgeCore.RenderManager.resetFrameBuffer();
            if (!this.camera.isActive)
                return;
            if (this.adjustingFrames)
                this.adjustFrames();
            if (this.adjustingCamera)
                this.adjustCamera();
            FudgeCore.RenderManager.clear(this.camera.backgroundColor);
            FudgeCore.RenderManager.drawGraph(this.graph, this.camera);
            this.crc2.imageSmoothingEnabled = false;
            this.crc2.drawImage(FudgeCore.RenderManager.getCanvas(), this.rectSource.x, this.rectSource.y, this.rectSource.width, this.rectSource.height, this.rectDestination.x, this.rectDestination.y, this.rectDestination.width, this.rectDestination.height);
        }
        /**
        * Draw this viewport for RayCast
        */
        createPickBuffers() {
            if (this.adjustingFrames)
                this.adjustFrames();
            if (this.adjustingCamera)
                this.adjustCamera();
            this.pickBuffers = FudgeCore.RenderManager.drawGraphForRayCast(this.graph, this.camera);
        }
        pickNodeAt(_pos) {
            // this.createPickBuffers();
            let hits = FudgeCore.RenderManager.pickNodeAt(_pos, this.pickBuffers, this.rectSource);
            hits.sort((a, b) => (b.zBuffer > 0) ? (a.zBuffer > 0) ? a.zBuffer - b.zBuffer : 1 : -1);
            return hits;
        }
        /**
         * Adjust all frames involved in the rendering process from the display area in the client up to the renderer canvas
         */
        adjustFrames() {
            // get the rectangle of the canvas area as displayed (consider css)
            let rectClient = this.getClientRectangle();
            // adjust the canvas size according to the given framing applied to client
            let rectCanvas = this.frameClientToCanvas.getRect(rectClient);
            this.canvas.width = rectCanvas.width;
            this.canvas.height = rectCanvas.height;
            // adjust the destination area on the target-canvas to render to by applying the framing to canvas
            this.rectDestination = this.frameCanvasToDestination.getRect(rectCanvas);
            // adjust the area on the source-canvas to render from by applying the framing to destination area
            this.rectSource = this.frameDestinationToSource.getRect(this.rectDestination);
            // having an offset source does make sense only when multiple viewports display parts of the same rendering. For now: shift it to 0,0
            this.rectSource.x = this.rectSource.y = 0;
            // still, a partial image of the rendering may be retrieved by moving and resizing the render viewport
            let rectRender = this.frameSourceToRender.getRect(this.rectSource);
            FudgeCore.RenderManager.setViewportRectangle(rectRender);
            // no more transformation after this for now, offscreen canvas and render-viewport have the same size
            FudgeCore.RenderManager.setCanvasSize(rectRender.width, rectRender.height);
        }
        /**
         * Adjust the camera parameters to fit the rendering into the render vieport
         */
        adjustCamera() {
            let rect = FudgeCore.RenderManager.getViewportRectangle();
            this.camera.projectCentral(rect.width / rect.height, this.camera.getFieldOfView(), this.camera.getDirection(), this.camera.getNear(), this.camera.getFar());
        }
        // #endregion
        //#region Points
        /**
         * Returns a [[Ray]] in world coordinates from this camera through the point given in client space
         */
        getRayFromClient(_point) {
            let posProjection = this.pointClientToProjection(_point);
            let ray = new FudgeCore.Ray(new FudgeCore.Vector3(-posProjection.x, posProjection.y, 1));
            // ray.direction.scale(camera.distance);
            ray.origin.transform(this.camera.pivot);
            ray.direction.transform(this.camera.pivot, false);
            let cameraNode = this.camera.getContainer();
            if (cameraNode) {
                ray.origin.transform(cameraNode.mtxWorld);
                ray.direction.transform(cameraNode.mtxWorld, false);
            }
            return ray;
        }
        pointWorldToClient(_position) {
            let projection = this.camera.project(_position);
            let posClient = this.pointClipToClient(projection.toVector2());
            return posClient;
        }
        /**
         * Returns a point on the source-rectangle matching the given point on the client rectangle
         */
        pointClientToSource(_client) {
            let result = this.frameClientToCanvas.getPoint(_client, this.getClientRectangle());
            result = this.frameCanvasToDestination.getPoint(result, this.getCanvasRectangle());
            result = this.frameDestinationToSource.getPoint(result, this.rectSource);
            //TODO: when Source, Render and RenderViewport deviate, continue transformation 
            return result;
        }
        /**
         * Returns a point on the render-rectangle matching the given point on the source rectangle
         */
        pointSourceToRender(_source) {
            let projectionRectangle = this.camera.getProjectionRectangle();
            let point = this.frameSourceToRender.getPoint(_source, projectionRectangle);
            return point;
        }
        /**
         * Returns a point on the render-rectangle matching the given point on the client rectangle
         */
        pointClientToRender(_client) {
            let point = this.pointClientToSource(_client);
            point = this.pointSourceToRender(point);
            //TODO: when Render and RenderViewport deviate, continue transformation 
            return point;
        }
        /**
         * Returns a point in normed view-rectangle matching the given point on the client rectangle
         * The view-rectangle matches the client size in the hypothetical distance of 1 to the camera, its origin in the center and y-axis pointing up
         * TODO: examine, if this should be a camera-method. Current implementation is for central-projection
         */
        pointClientToProjection(_client) {
            let posRender = this.pointClientToRender(_client);
            let rectRender = this.frameSourceToRender.getRect(this.rectSource);
            let rectProjection = this.camera.getProjectionRectangle();
            let posProjection = new FudgeCore.Vector2(rectProjection.width * posRender.x / rectRender.width, rectProjection.height * posRender.y / rectRender.height);
            posProjection.subtract(new FudgeCore.Vector2(rectProjection.width / 2, rectProjection.height / 2));
            posProjection.y *= -1;
            return posProjection;
        }
        /**
         * Returns a point in the client rectangle matching the given point in normed clipspace rectangle,
         * which stretches from -1 to 1 in both dimensions, y pointing up
         */
        pointClipToClient(_normed) {
            // let rectClient: Rectangle = this.getClientRectangle();
            // let result: Vector2 = Vector2.ONE(0.5);
            // result.x *= (_normed.x + 1) * rectClient.width;
            // result.y *= (1 - _normed.y) * rectClient.height;
            // result.add(rectClient.position);
            //TODO: check if rectDestination can be safely (and more perfomant) be used instead getClientRectangle
            let pointClient = FudgeCore.RenderManager.rectClip.pointToRect(_normed, this.rectDestination);
            return pointClient;
        }
        /**
         * Returns a point in the client rectangle matching the given point in normed clipspace rectangle,
         * which stretches from -1 to 1 in both dimensions, y pointing up
         */
        pointClipToCanvas(_normed) {
            let pointCanvas = FudgeCore.RenderManager.rectClip.pointToRect(_normed, this.getCanvasRectangle());
            return pointCanvas;
        }
        pointClientToScreen(_client) {
            let screen = new FudgeCore.Vector2(this.canvas.offsetLeft + _client.x, this.canvas.offsetTop + _client.y);
            return screen;
        }
        /**
         * Switch the viewports focus on or off. Only one viewport in one FUDGE instance can have the focus, thus receiving keyboard events.
         * So a viewport currently having the focus will lose it, when another one receives it. The viewports fire [[Event]]s accordingly.
         * // TODO: examine, if this can be achieved by regular DOM-Focus and tabindex=0
         * @param _on
         */
        setFocus(_on) {
            if (_on) {
                if (Viewport.focus == this)
                    return;
                if (Viewport.focus)
                    Viewport.focus.dispatchEvent(new Event("focusout" /* FOCUS_OUT */));
                Viewport.focus = this;
                this.dispatchEvent(new Event("focusin" /* FOCUS_IN */));
            }
            else {
                if (Viewport.focus != this)
                    return;
                this.dispatchEvent(new Event("focusout" /* FOCUS_OUT */));
                Viewport.focus = null;
            }
        }
        /**
         * De- / Activates the given pointer event to be propagated into the viewport as FUDGE-Event
         * @param _type
         * @param _on
         */
        activatePointerEvent(_type, _on) {
            this.activateEvent(this.canvas, _type, this.hndPointerEvent, _on);
        }
        /**
         * De- / Activates the given keyboard event to be propagated into the viewport as FUDGE-Event
         * @param _type
         * @param _on
         */
        activateKeyboardEvent(_type, _on) {
            this.activateEvent(this.canvas.ownerDocument, _type, this.hndKeyboardEvent, _on);
        }
        /**
         * De- / Activates the given drag-drop event to be propagated into the viewport as FUDGE-Event
         * @param _type
         * @param _on
         */
        activateDragDropEvent(_type, _on) {
            if (_type == "\u0192dragstart" /* START */)
                this.canvas.draggable = _on;
            this.activateEvent(this.canvas, _type, this.hndDragDropEvent, _on);
        }
        /**
         * De- / Activates the wheel event to be propagated into the viewport as FUDGE-Event
         * @param _type
         * @param _on
         */
        activateWheelEvent(_type, _on) {
            this.activateEvent(this.canvas, _type, this.hndWheelEvent, _on);
        }
        /**
         * Add position of the pointer mapped to canvas-coordinates as canvasX, canvasY to the event
         * @param event
         */
        addCanvasPosition(event) {
            event.canvasX = this.canvas.width * event.pointerX / event.clientRect.width;
            event.canvasY = this.canvas.height * event.pointerY / event.clientRect.height;
        }
        activateEvent(_target, _type, _handler, _on) {
            _type = _type.slice(1); // chip the ƒlorin
            if (_on)
                _target.addEventListener(_type, _handler);
            else
                _target.removeEventListener(_type, _handler);
        }
        hndComponentEvent(_event) {
            FudgeCore.Debug.fudge(_event);
        }
    }
    FudgeCore.Viewport = Viewport;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventDragDrop extends DragEvent {
        constructor(type, _event) {
            super(type, _event);
            let target = _event.target;
            this.clientRect = target.getClientRects()[0];
            this.pointerX = _event.clientX - this.clientRect.left;
            this.pointerY = _event.clientY - this.clientRect.top;
        }
    }
    FudgeCore.EventDragDrop = EventDragDrop;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventKeyboard extends KeyboardEvent {
        constructor(type, _event) {
            super(type, _event);
        }
    }
    FudgeCore.EventKeyboard = EventKeyboard;
    /**
     * The codes sent from a standard english keyboard layout
     */
    let KEYBOARD_CODE;
    (function (KEYBOARD_CODE) {
        KEYBOARD_CODE["A"] = "KeyA";
        KEYBOARD_CODE["B"] = "KeyB";
        KEYBOARD_CODE["C"] = "KeyC";
        KEYBOARD_CODE["D"] = "KeyD";
        KEYBOARD_CODE["E"] = "KeyE";
        KEYBOARD_CODE["F"] = "KeyF";
        KEYBOARD_CODE["G"] = "KeyG";
        KEYBOARD_CODE["H"] = "KeyH";
        KEYBOARD_CODE["I"] = "KeyI";
        KEYBOARD_CODE["J"] = "KeyJ";
        KEYBOARD_CODE["K"] = "KeyK";
        KEYBOARD_CODE["L"] = "KeyL";
        KEYBOARD_CODE["M"] = "KeyM";
        KEYBOARD_CODE["N"] = "KeyN";
        KEYBOARD_CODE["O"] = "KeyO";
        KEYBOARD_CODE["P"] = "KeyP";
        KEYBOARD_CODE["Q"] = "KeyQ";
        KEYBOARD_CODE["R"] = "KeyR";
        KEYBOARD_CODE["S"] = "KeyS";
        KEYBOARD_CODE["T"] = "KeyT";
        KEYBOARD_CODE["U"] = "KeyU";
        KEYBOARD_CODE["V"] = "KeyV";
        KEYBOARD_CODE["W"] = "KeyW";
        KEYBOARD_CODE["X"] = "KeyX";
        KEYBOARD_CODE["Y"] = "KeyY";
        KEYBOARD_CODE["Z"] = "KeyZ";
        KEYBOARD_CODE["ESC"] = "Escape";
        KEYBOARD_CODE["ZERO"] = "Digit0";
        KEYBOARD_CODE["ONE"] = "Digit1";
        KEYBOARD_CODE["TWO"] = "Digit2";
        KEYBOARD_CODE["THREE"] = "Digit3";
        KEYBOARD_CODE["FOUR"] = "Digit4";
        KEYBOARD_CODE["FIVE"] = "Digit5";
        KEYBOARD_CODE["SIX"] = "Digit6";
        KEYBOARD_CODE["SEVEN"] = "Digit7";
        KEYBOARD_CODE["EIGHT"] = "Digit8";
        KEYBOARD_CODE["NINE"] = "Digit9";
        KEYBOARD_CODE["MINUS"] = "Minus";
        KEYBOARD_CODE["EQUAL"] = "Equal";
        KEYBOARD_CODE["BACKSPACE"] = "Backspace";
        KEYBOARD_CODE["TABULATOR"] = "Tab";
        KEYBOARD_CODE["BRACKET_LEFT"] = "BracketLeft";
        KEYBOARD_CODE["BRACKET_RIGHT"] = "BracketRight";
        KEYBOARD_CODE["ENTER"] = "Enter";
        KEYBOARD_CODE["CTRL_LEFT"] = "ControlLeft";
        KEYBOARD_CODE["SEMICOLON"] = "Semicolon";
        KEYBOARD_CODE["QUOTE"] = "Quote";
        KEYBOARD_CODE["BACK_QUOTE"] = "Backquote";
        KEYBOARD_CODE["SHIFT_LEFT"] = "ShiftLeft";
        KEYBOARD_CODE["BACKSLASH"] = "Backslash";
        KEYBOARD_CODE["COMMA"] = "Comma";
        KEYBOARD_CODE["PERIOD"] = "Period";
        KEYBOARD_CODE["SLASH"] = "Slash";
        KEYBOARD_CODE["SHIFT_RIGHT"] = "ShiftRight";
        KEYBOARD_CODE["NUMPAD_MULTIPLY"] = "NumpadMultiply";
        KEYBOARD_CODE["ALT_LEFT"] = "AltLeft";
        KEYBOARD_CODE["SPACE"] = "Space";
        KEYBOARD_CODE["CAPS_LOCK"] = "CapsLock";
        KEYBOARD_CODE["F1"] = "F1";
        KEYBOARD_CODE["F2"] = "F2";
        KEYBOARD_CODE["F3"] = "F3";
        KEYBOARD_CODE["F4"] = "F4";
        KEYBOARD_CODE["F5"] = "F5";
        KEYBOARD_CODE["F6"] = "F6";
        KEYBOARD_CODE["F7"] = "F7";
        KEYBOARD_CODE["F8"] = "F8";
        KEYBOARD_CODE["F9"] = "F9";
        KEYBOARD_CODE["F10"] = "F10";
        KEYBOARD_CODE["PAUSE"] = "Pause";
        KEYBOARD_CODE["SCROLL_LOCK"] = "ScrollLock";
        KEYBOARD_CODE["NUMPAD7"] = "Numpad7";
        KEYBOARD_CODE["NUMPAD8"] = "Numpad8";
        KEYBOARD_CODE["NUMPAD9"] = "Numpad9";
        KEYBOARD_CODE["NUMPAD_SUBTRACT"] = "NumpadSubtract";
        KEYBOARD_CODE["NUMPAD4"] = "Numpad4";
        KEYBOARD_CODE["NUMPAD5"] = "Numpad5";
        KEYBOARD_CODE["NUMPAD6"] = "Numpad6";
        KEYBOARD_CODE["NUMPAD_ADD"] = "NumpadAdd";
        KEYBOARD_CODE["NUMPAD1"] = "Numpad1";
        KEYBOARD_CODE["NUMPAD2"] = "Numpad2";
        KEYBOARD_CODE["NUMPAD3"] = "Numpad3";
        KEYBOARD_CODE["NUMPAD0"] = "Numpad0";
        KEYBOARD_CODE["NUMPAD_DECIMAL"] = "NumpadDecimal";
        KEYBOARD_CODE["PRINT_SCREEN"] = "PrintScreen";
        KEYBOARD_CODE["INTL_BACK_SLASH"] = "IntlBackSlash";
        KEYBOARD_CODE["F11"] = "F11";
        KEYBOARD_CODE["F12"] = "F12";
        KEYBOARD_CODE["NUMPAD_EQUAL"] = "NumpadEqual";
        KEYBOARD_CODE["F13"] = "F13";
        KEYBOARD_CODE["F14"] = "F14";
        KEYBOARD_CODE["F15"] = "F15";
        KEYBOARD_CODE["F16"] = "F16";
        KEYBOARD_CODE["F17"] = "F17";
        KEYBOARD_CODE["F18"] = "F18";
        KEYBOARD_CODE["F19"] = "F19";
        KEYBOARD_CODE["F20"] = "F20";
        KEYBOARD_CODE["F21"] = "F21";
        KEYBOARD_CODE["F22"] = "F22";
        KEYBOARD_CODE["F23"] = "F23";
        KEYBOARD_CODE["F24"] = "F24";
        KEYBOARD_CODE["KANA_MODE"] = "KanaMode";
        KEYBOARD_CODE["LANG2"] = "Lang2";
        KEYBOARD_CODE["LANG1"] = "Lang1";
        KEYBOARD_CODE["INTL_RO"] = "IntlRo";
        KEYBOARD_CODE["CONVERT"] = "Convert";
        KEYBOARD_CODE["NON_CONVERT"] = "NonConvert";
        KEYBOARD_CODE["INTL_YEN"] = "IntlYen";
        KEYBOARD_CODE["NUMPAD_COMMA"] = "NumpadComma";
        KEYBOARD_CODE["UNDO"] = "Undo";
        KEYBOARD_CODE["PASTE"] = "Paste";
        KEYBOARD_CODE["MEDIA_TRACK_PREVIOUS"] = "MediaTrackPrevious";
        KEYBOARD_CODE["CUT"] = "Cut";
        KEYBOARD_CODE["COPY"] = "Copy";
        KEYBOARD_CODE["MEDIA_TRACK_NEXT"] = "MediaTrackNext";
        KEYBOARD_CODE["NUMPAD_ENTER"] = "NumpadEnter";
        KEYBOARD_CODE["CTRL_RIGHT"] = "ControlRight";
        KEYBOARD_CODE["AUDIO_VOLUME_MUTE"] = "AudioVolumeMute";
        KEYBOARD_CODE["LAUNCH_APP2"] = "LaunchApp2";
        KEYBOARD_CODE["MEDIA_PLAY_PAUSE"] = "MediaPlayPause";
        KEYBOARD_CODE["MEDIA_STOP"] = "MediaStop";
        KEYBOARD_CODE["EJECT"] = "Eject";
        KEYBOARD_CODE["AUDIO_VOLUME_DOWN"] = "AudioVolumeDown";
        KEYBOARD_CODE["VOLUME_DOWN"] = "VolumeDown";
        KEYBOARD_CODE["AUDIO_VOLUME_UP"] = "AudioVolumeUp";
        KEYBOARD_CODE["VOLUME_UP"] = "VolumeUp";
        KEYBOARD_CODE["BROWSER_HOME"] = "BrowserHome";
        KEYBOARD_CODE["NUMPAD_DIVIDE"] = "NumpadDivide";
        KEYBOARD_CODE["ALT_RIGHT"] = "AltRight";
        KEYBOARD_CODE["HELP"] = "Help";
        KEYBOARD_CODE["NUM_LOCK"] = "NumLock";
        KEYBOARD_CODE["HOME"] = "Home";
        KEYBOARD_CODE["ARROW_UP"] = "ArrowUp";
        KEYBOARD_CODE["ARROW_RIGHT"] = "ArrowRight";
        KEYBOARD_CODE["ARROW_DOWN"] = "ArrowDown";
        KEYBOARD_CODE["ARROW_LEFT"] = "ArrowLeft";
        KEYBOARD_CODE["END"] = "End";
        KEYBOARD_CODE["PAGE_UP"] = "PageUp";
        KEYBOARD_CODE["PAGE_DOWN"] = "PageDown";
        KEYBOARD_CODE["INSERT"] = "Insert";
        KEYBOARD_CODE["DELETE"] = "Delete";
        KEYBOARD_CODE["META_LEFT"] = "Meta_Left";
        KEYBOARD_CODE["OS_LEFT"] = "OSLeft";
        KEYBOARD_CODE["META_RIGHT"] = "MetaRight";
        KEYBOARD_CODE["OS_RIGHT"] = "OSRight";
        KEYBOARD_CODE["CONTEXT_MENU"] = "ContextMenu";
        KEYBOARD_CODE["POWER"] = "Power";
        KEYBOARD_CODE["BROWSER_SEARCH"] = "BrowserSearch";
        KEYBOARD_CODE["BROWSER_FAVORITES"] = "BrowserFavorites";
        KEYBOARD_CODE["BROWSER_REFRESH"] = "BrowserRefresh";
        KEYBOARD_CODE["BROWSER_STOP"] = "BrowserStop";
        KEYBOARD_CODE["BROWSER_FORWARD"] = "BrowserForward";
        KEYBOARD_CODE["BROWSER_BACK"] = "BrowserBack";
        KEYBOARD_CODE["LAUNCH_APP1"] = "LaunchApp1";
        KEYBOARD_CODE["LAUNCH_MAIL"] = "LaunchMail";
        KEYBOARD_CODE["LAUNCH_MEDIA_PLAYER"] = "LaunchMediaPlayer";
        //mac brings this buttton
        KEYBOARD_CODE["FN"] = "Fn";
        //Linux brings these
        KEYBOARD_CODE["AGAIN"] = "Again";
        KEYBOARD_CODE["PROPS"] = "Props";
        KEYBOARD_CODE["SELECT"] = "Select";
        KEYBOARD_CODE["OPEN"] = "Open";
        KEYBOARD_CODE["FIND"] = "Find";
        KEYBOARD_CODE["WAKE_UP"] = "WakeUp";
        KEYBOARD_CODE["NUMPAD_PARENT_LEFT"] = "NumpadParentLeft";
        KEYBOARD_CODE["NUMPAD_PARENT_RIGHT"] = "NumpadParentRight";
        //android
        KEYBOARD_CODE["SLEEP"] = "Sleep";
    })(KEYBOARD_CODE = FudgeCore.KEYBOARD_CODE || (FudgeCore.KEYBOARD_CODE = {}));
    /*
    Firefox can't make use of those buttons and Combinations:
    SINGELE_BUTTONS:
     Druck,
    COMBINATIONS:
     Shift + F10, Shift + Numpad5,
     CTRL + q, CTRL + F4,
     ALT + F1, ALT + F2, ALT + F3, ALT + F7, ALT + F8, ALT + F10
    Opera won't do good with these Buttons and combinations:
    SINGLE_BUTTONS:
     Float32Array, F11, ALT,
    COMBINATIONS:
     CTRL + q, CTRL + t, CTRL + h, CTRL + g, CTRL + n, CTRL + f
     ALT + F1, ALT + F2, ALT + F4, ALT + F5, ALT + F6, ALT + F7, ALT + F8, ALT + F10
     */
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventPointer extends PointerEvent {
        constructor(type, _event) {
            super(type, _event);
            let target = _event.target;
            this.clientRect = target.getClientRects()[0];
            this.pointerX = _event.clientX - this.clientRect.left;
            this.pointerY = _event.clientY - this.clientRect.top;
        }
    }
    FudgeCore.EventPointer = EventPointer;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventTimer {
        constructor(_timer, ..._arguments) {
            this.type = "\u0192lapse" /* CALL */;
            this.firstCall = true;
            this.lastCall = false;
            this.target = _timer;
            this.arguments = _arguments;
            this.firstCall = true;
        }
    }
    FudgeCore.EventTimer = EventTimer;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventWheel extends WheelEvent {
        constructor(type, _event) {
            super(type, _event);
        }
    }
    FudgeCore.EventWheel = EventWheel;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * A node managed by [[Project]] that functions as a template for [[GraphInstance]]s
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/JirkaDellOro/FUDGE/wiki/Resource
     */
    class Graph extends FudgeCore.Node {
        constructor() {
            super(...arguments);
            this.idResource = undefined;
            this.type = "Graph";
        }
        serialize() {
            let serialization = super.serialize();
            serialization.idResource = this.idResource;
            serialization.type = this.type;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            FudgeCore.Project.register(this, _serialization.idResource);
            return this;
        }
    }
    FudgeCore.Graph = Graph;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * An instance of a [[Graph]].
     * This node keeps a reference to its resource an can thus optimize serialization
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/JirkaDellOro/FUDGE/wiki/Resource
     */
    class GraphInstance extends FudgeCore.Node {
        constructor(_graph) {
            super("Graph");
            /** id of the resource that instance was created from */
            // TODO: examine, if this should be a direct reference to the Graph, instead of the id
            this.idSource = undefined;
            if (!_graph)
                return;
            this.idSource = _graph.idResource;
            this.reset();
        }
        /**
         * Recreate this node from the [[Graph]] referenced
         */
        async reset() {
            let resource = await FudgeCore.Project.getResource(this.idSource);
            await this.set(resource);
        }
        //TODO: optimize using the referenced Graph, serialize/deserialize only the differences
        serialize() {
            let serialization = super.serialize();
            serialization.idSource = this.idSource;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            this.idSource = _serialization.idSource;
            return this;
        }
        /**
         * Set this node to be a recreation of the [[Graph]] given
         */
        async set(_graph) {
            // TODO: examine, if the serialization should be stored in the Graph for optimization
            let serialization = FudgeCore.Serializer.serialize(_graph);
            //Serializer.deserialize(serialization);
            for (let path in serialization) {
                await this.deserialize(serialization[path]);
                break;
            }
            this.idSource = _graph.idResource;
            this.dispatchEvent(new Event("graphInstantiated" /* GRAPH_INSTANTIATED */));
        }
    }
    FudgeCore.GraphInstance = GraphInstance;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Framing describes how to map a rectangle into a given frame
     * and how points in the frame correspond to points in the resulting rectangle and vice versa
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     * @link https://github.com/JirkaDellOro/FUDGE/wiki/Framing
     */
    class Framing extends FudgeCore.Mutable {
        reduceMutator(_mutator) { }
    }
    FudgeCore.Framing = Framing;
    /**
     * The resulting rectangle has a fixed width and height and display should scale to fit the frame
     * Points are scaled in the same ratio
     */
    class FramingFixed extends Framing {
        constructor(_width = 300, _height = 150) {
            super();
            this.width = 300;
            this.height = 150;
            this.setSize(_width, _height);
        }
        setSize(_width, _height) {
            this.width = _width;
            this.height = _height;
        }
        getPoint(_pointInFrame, _rectFrame) {
            let result = new FudgeCore.Vector2(this.width * (_pointInFrame.x - _rectFrame.x) / _rectFrame.width, this.height * (_pointInFrame.y - _rectFrame.y) / _rectFrame.height);
            return result;
        }
        getPointInverse(_point, _rect) {
            let result = new FudgeCore.Vector2(_point.x * _rect.width / this.width + _rect.x, _point.y * _rect.height / this.height + _rect.y);
            return result;
        }
        getRect(_rectFrame) {
            return FudgeCore.Rectangle.GET(0, 0, this.width, this.height);
        }
    }
    FudgeCore.FramingFixed = FramingFixed;
    /**
     * Width and height of the resulting rectangle are fractions of those of the frame, scaled by normed values normWidth and normHeight.
     * Display should scale to fit the frame and points are scaled in the same ratio
     */
    class FramingScaled extends Framing {
        constructor() {
            super(...arguments);
            this.normWidth = 1.0;
            this.normHeight = 1.0;
        }
        setScale(_normWidth, _normHeight) {
            this.normWidth = _normWidth;
            this.normHeight = _normHeight;
        }
        getPoint(_pointInFrame, _rectFrame) {
            let result = new FudgeCore.Vector2(this.normWidth * (_pointInFrame.x - _rectFrame.x), this.normHeight * (_pointInFrame.y - _rectFrame.y));
            return result;
        }
        getPointInverse(_point, _rect) {
            let result = new FudgeCore.Vector2(_point.x / this.normWidth + _rect.x, _point.y / this.normHeight + _rect.y);
            return result;
        }
        getRect(_rectFrame) {
            return FudgeCore.Rectangle.GET(0, 0, this.normWidth * _rectFrame.width, this.normHeight * _rectFrame.height);
        }
    }
    FudgeCore.FramingScaled = FramingScaled;
    /**
     * The resulting rectangle fits into a margin given as fractions of the size of the frame given by normAnchor
     * plus an absolute padding given by pixelBorder. Display should fit into this.
     */
    class FramingComplex extends Framing {
        constructor() {
            super(...arguments);
            this.margin = { left: 0, top: 0, right: 0, bottom: 0 };
            this.padding = { left: 0, top: 0, right: 0, bottom: 0 };
        }
        getPoint(_pointInFrame, _rectFrame) {
            let result = new FudgeCore.Vector2(_pointInFrame.x - this.padding.left - this.margin.left * _rectFrame.width, _pointInFrame.y - this.padding.top - this.margin.top * _rectFrame.height);
            return result;
        }
        getPointInverse(_point, _rect) {
            let result = new FudgeCore.Vector2(_point.x + this.padding.left + this.margin.left * _rect.width, _point.y + this.padding.top + this.margin.top * _rect.height);
            return result;
        }
        getRect(_rectFrame) {
            if (!_rectFrame)
                return null;
            let minX = _rectFrame.x + this.margin.left * _rectFrame.width + this.padding.left;
            let minY = _rectFrame.y + this.margin.top * _rectFrame.height + this.padding.top;
            let maxX = _rectFrame.x + (1 - this.margin.right) * _rectFrame.width - this.padding.right;
            let maxY = _rectFrame.y + (1 - this.margin.bottom) * _rectFrame.height - this.padding.bottom;
            return FudgeCore.Rectangle.GET(minX, minY, maxX - minX, maxY - minY);
        }
        getMutator() {
            return { margin: this.margin, padding: this.padding };
        }
    }
    FudgeCore.FramingComplex = FramingComplex;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Simple class for 3x3 matrix operations
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class Matrix3x3 extends FudgeCore.Mutable {
        constructor() {
            super();
            this.data = new Float32Array(3); // The data of the matrix.
            this.mutator = null; // prepared for optimization, keep mutator to reduce redundant calculation and for comparison. Set to null when data changes!
            this.data = new Float32Array([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);
            this.resetCache();
        }
        //TODO: figure out what this is used for
        static PROJECTION(_width, _height) {
            let matrix = new Matrix3x3;
            matrix.data.set([
                2 / _width, 0, 0,
                0, -2 / _height, 0,
                -1, 1, 1
            ]);
            return matrix;
        }
        static IDENTITY() {
            const result = FudgeCore.Recycler.get(Matrix3x3);
            result.data.set([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ]);
            return result;
        }
        /**
         * Returns a matrix that translates coordinates along the x-, y- and z-axis according to the given vector.
         */
        static TRANSLATION(_translate) {
            const matrix = FudgeCore.Recycler.get(Matrix3x3);
            matrix.data.set([
                1, 0, 0,
                0, 1, 0,
                _translate.x, _translate.y, 1
            ]);
            return matrix;
        }
        /**
         * Returns a matrix that rotates coordinates on the z-axis when multiplied by.
         * @param _angleInDegrees The value of the rotation.
         */
        static ROTATION(_angleInDegrees) {
            // const matrix: Matrix3x3 = new Matrix3x3;
            const matrix = FudgeCore.Recycler.get(Matrix3x3);
            let angleInRadians = _angleInDegrees * Math.PI / 180;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            matrix.data.set([
                cos, sin, 0,
                -sin, cos, 0,
                0, 0, 1
            ]);
            return matrix;
        }
        /**
         * Returns a matrix that scales coordinates along the x-, y- and z-axis according to the given vector
         */
        static SCALING(_scalar) {
            // const matrix: Matrix3x3 = new Matrix3x3;
            const matrix = FudgeCore.Recycler.get(Matrix3x3);
            matrix.data.set([
                _scalar.x, 0, 0,
                0, _scalar.y, 0,
                0, 0, 1
            ]);
            return matrix;
        }
        //#endregion
        static MULTIPLICATION(_a, _b) {
            let a00 = _a.data[0 * 3 + 0];
            let a01 = _a.data[0 * 3 + 1];
            let a02 = _a.data[0 * 3 + 2];
            let a10 = _a.data[1 * 3 + 0];
            let a11 = _a.data[1 * 3 + 1];
            let a12 = _a.data[1 * 3 + 2];
            let a20 = _a.data[2 * 3 + 0];
            let a21 = _a.data[2 * 3 + 1];
            let a22 = _a.data[2 * 3 + 2];
            let b00 = _b.data[0 * 3 + 0];
            let b01 = _b.data[0 * 3 + 1];
            let b02 = _b.data[0 * 3 + 2];
            let b10 = _b.data[1 * 3 + 0];
            let b11 = _b.data[1 * 3 + 1];
            let b12 = _b.data[1 * 3 + 2];
            let b20 = _b.data[2 * 3 + 0];
            let b21 = _b.data[2 * 3 + 1];
            let b22 = _b.data[2 * 3 + 2];
            let matrix = new Matrix3x3;
            matrix.data.set([
                b00 * a00 + b01 * a10 + b02 * a20,
                b00 * a01 + b01 * a11 + b02 * a21,
                b00 * a02 + b01 * a12 + b02 * a22,
                b10 * a00 + b11 * a10 + b12 * a20,
                b10 * a01 + b11 * a11 + b12 * a21,
                b10 * a02 + b11 * a12 + b12 * a22,
                b20 * a00 + b21 * a10 + b22 * a20,
                b20 * a01 + b21 * a11 + b22 * a21,
                b20 * a02 + b21 * a12 + b22 * a22
            ]);
            return matrix;
        }
        /**
         * - get: a copy of the calculated translation vector
         * - set: effect the matrix ignoring its rotation and scaling
         */
        get translation() {
            if (!this.vectors.translation)
                this.vectors.translation = new FudgeCore.Vector2(this.data[6], this.data[7]);
            return this.vectors.translation.copy;
        }
        set translation(_translation) {
            this.data.set(_translation.get(), 12);
            // no full cache reset required
            this.vectors.translation = _translation;
            this.mutator = null;
        }
        /**
         * - get: a copy of the calculated rotation vector
         * - set: effect the matrix
         */
        get rotation() {
            if (!this.vectors.rotation)
                this.vectors.rotation = this.getEulerAngles();
            return this.vectors.rotation;
        }
        set rotation(_rotation) {
            this.mutate({ "rotation": _rotation });
            this.resetCache();
        }
        /**
         * - get: a copy of the calculated scale vector
         * - set: effect the matrix
         */
        get scaling() {
            if (!this.vectors.scaling)
                this.vectors.scaling = new FudgeCore.Vector2(Math.hypot(this.data[0], this.data[1]), Math.hypot(this.data[3], this.data[4]));
            return this.vectors.scaling.copy;
        }
        set scaling(_scaling) {
            this.mutate({ "scaling": _scaling });
            this.resetCache();
        }
        /**
         * Return a copy of this
         */
        get copy() {
            let copy = new Matrix3x3();
            copy.set(this);
            return copy;
        }
        //#region Translation
        /**
         * Add a translation by the given vector to this matrix
         */
        translate(_by) {
            const matrix = Matrix3x3.MULTIPLICATION(this, Matrix3x3.TRANSLATION(_by));
            // TODO: possible optimization, translation may alter mutator instead of deleting it.
            this.set(matrix);
            FudgeCore.Recycler.store(matrix);
        }
        /**
         * Add a translation along the x-Axis by the given amount to this matrix
         */
        translateX(_x) {
            this.data[6] += _x;
            this.mutator = null;
            this.vectors.translation = null;
        }
        /**
         * Add a translation along the y-Axis by the given amount to this matrix
         */
        translateY(_y) {
            this.data[7] += _y;
            this.mutator = null;
            this.vectors.translation = null;
        }
        //#endregion
        //#region Scaling
        /**
         * Add a scaling by the given vector to this matrix
         */
        scale(_by) {
            const matrix = Matrix3x3.MULTIPLICATION(this, Matrix3x3.SCALING(_by));
            this.set(matrix);
            FudgeCore.Recycler.store(matrix);
        }
        /**
         * Add a scaling along the x-Axis by the given amount to this matrix
         */
        scaleX(_by) {
            let vector = FudgeCore.Recycler.borrow(FudgeCore.Vector2);
            vector.set(_by, 1);
            this.scale(vector);
        }
        /**
         * Add a scaling along the y-Axis by the given amount to this matrix
         */
        scaleY(_by) {
            let vector = FudgeCore.Recycler.borrow(FudgeCore.Vector2);
            vector.set(1, _by);
            this.scale(vector);
        }
        //#endregion
        //#region Rotation
        /**
         * Adds a rotation around the z-Axis to this matrix
         */
        rotate(_angleInDegrees) {
            const matrix = Matrix3x3.MULTIPLICATION(this, Matrix3x3.ROTATION(_angleInDegrees));
            this.set(matrix);
            FudgeCore.Recycler.store(matrix);
        }
        //#endregion
        //#region Transformation
        /**
         * Multiply this matrix with the given matrix
         */
        multiply(_matrix) {
            this.set(Matrix3x3.MULTIPLICATION(this, _matrix));
            this.mutator = null;
        }
        //#endregion
        //#region Transfer
        /**
         * Calculates and returns the euler-angles representing the current rotation of this matrix
         */
        getEulerAngles() {
            let scaling = this.scaling;
            let s0 = this.data[0] / scaling.x;
            let s1 = this.data[1] / scaling.x;
            let s3 = this.data[3] / scaling.y;
            let s4 = this.data[4] / scaling.y;
            let xSkew = Math.atan2(-s3, s4);
            let ySkew = Math.atan2(s0, s1);
            let sy = Math.hypot(s0, s1); // probably 2. param should be this.data[4] / scaling.y
            let rotation;
            if (!(sy > 1e-6))
                rotation = ySkew;
            else
                rotation = xSkew;
            rotation *= 180 / Math.PI;
            return rotation;
        }
        /**
         * Sets the elements of this matrix to the values of the given matrix
         */
        set(_to) {
            // this.data = _to.get();
            this.data.set(_to.data);
            this.resetCache();
        }
        toString() {
            return `ƒ.Matrix3x3(translation: ${this.translation.toString()}, rotation: ${this.rotation.toString()}, scaling: ${this.scaling.toString()}`;
        }
        /**
         * Return the elements of this matrix as a Float32Array
         */
        get() {
            return new Float32Array(this.data);
        }
        serialize() {
            // this.getMutator();
            let serialization = {
                translation: this.translation.serialize(),
                rotation: this.rotation,
                scaling: this.scaling.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            let mutator = {
                translation: await this.translation.deserialize(_serialization.translation),
                rotation: _serialization.rotation,
                scaling: await this.scaling.deserialize(_serialization.scaling)
            };
            this.mutate(mutator);
            return this;
        }
        getMutator() {
            if (this.mutator)
                return this.mutator;
            let mutator = {
                translation: this.translation.getMutator(),
                rotation: this.rotation,
                scaling: this.scaling.getMutator()
            };
            // cache mutator
            this.mutator = mutator;
            return mutator;
        }
        async mutate(_mutator) {
            let oldTranslation = this.translation;
            let oldRotation = this.rotation;
            let oldScaling = this.scaling;
            let newTranslation = _mutator["translation"];
            let newRotation = _mutator["rotation"];
            let newScaling = _mutator["scaling"];
            let vectors = { translation: oldTranslation, rotation: oldRotation, scaling: oldScaling };
            if (newTranslation) {
                vectors.translation = new FudgeCore.Vector2(newTranslation.x != undefined ? newTranslation.x : oldTranslation.x, newTranslation.y != undefined ? newTranslation.y : oldTranslation.y);
            }
            vectors.rotation = (newRotation == undefined) ? oldRotation : newRotation;
            if (newScaling) {
                vectors.scaling = new FudgeCore.Vector2(newScaling.x != undefined ? newScaling.x : oldScaling.x, newScaling.y != undefined ? newScaling.y : oldScaling.y);
            }
            // TODO: possible performance optimization when only one or two components change, then use old matrix instead of IDENTITY and transform by differences/quotients
            let matrix = Matrix3x3.IDENTITY();
            if (vectors.translation)
                matrix.translate(vectors.translation);
            if (vectors.rotation) {
                matrix.rotate(vectors.rotation);
            }
            if (vectors.scaling)
                matrix.scale(vectors.scaling);
            this.set(matrix);
            this.vectors = vectors;
        }
        getMutatorAttributeTypes(_mutator) {
            let types = {};
            if (_mutator.translation)
                types.translation = "Vector2";
            if (_mutator.rotation != undefined)
                types.rotation = "number";
            if (_mutator.scaling)
                types.scaling = "Vector2";
            return types;
        }
        reduceMutator(_mutator) { }
        resetCache() {
            this.vectors = { translation: null, rotation: null, scaling: null };
            this.mutator = null;
        }
    }
    FudgeCore.Matrix3x3 = Matrix3x3;
    //#endregion
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Stores a 4x4 transformation matrix and provides operations for it.
     * ```plaintext
     * [ 0, 1, 2, 3 ] ← row vector x
     * [ 4, 5, 6, 7 ] ← row vector y
     * [ 8, 9,10,11 ] ← row vector z
     * [12,13,14,15 ] ← translation
     *            ↑  homogeneous column
     * ```
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Matrix4x4 extends FudgeCore.Mutable {
        constructor() {
            super();
            this.data = new Float32Array(16); // The data of the matrix.
            this.mutator = null; // prepared for optimization, keep mutator to reduce redundant calculation and for comparison. Set to null when data changes!
            this.data.set([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
            this.resetCache();
        }
        //#region STATICS
        /**
         * Retrieve a new identity matrix
         */
        static IDENTITY() {
            // const result: Matrix4x4 = new Matrix4x4();
            const result = FudgeCore.Recycler.get(Matrix4x4);
            result.data.set([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
            return result;
        }
        /**
         * Computes and returns the product of two passed matrices.
         * @param _a The matrix to multiply.
         * @param _b The matrix to multiply by.
         */
        static MULTIPLICATION(_a, _b) {
            let a = _a.data;
            let b = _b.data;
            // let matrix: Matrix4x4 = new Matrix4x4();
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            let a00 = a[0 * 4 + 0];
            let a01 = a[0 * 4 + 1];
            let a02 = a[0 * 4 + 2];
            let a03 = a[0 * 4 + 3];
            let a10 = a[1 * 4 + 0];
            let a11 = a[1 * 4 + 1];
            let a12 = a[1 * 4 + 2];
            let a13 = a[1 * 4 + 3];
            let a20 = a[2 * 4 + 0];
            let a21 = a[2 * 4 + 1];
            let a22 = a[2 * 4 + 2];
            let a23 = a[2 * 4 + 3];
            let a30 = a[3 * 4 + 0];
            let a31 = a[3 * 4 + 1];
            let a32 = a[3 * 4 + 2];
            let a33 = a[3 * 4 + 3];
            let b00 = b[0 * 4 + 0];
            let b01 = b[0 * 4 + 1];
            let b02 = b[0 * 4 + 2];
            let b03 = b[0 * 4 + 3];
            let b10 = b[1 * 4 + 0];
            let b11 = b[1 * 4 + 1];
            let b12 = b[1 * 4 + 2];
            let b13 = b[1 * 4 + 3];
            let b20 = b[2 * 4 + 0];
            let b21 = b[2 * 4 + 1];
            let b22 = b[2 * 4 + 2];
            let b23 = b[2 * 4 + 3];
            let b30 = b[3 * 4 + 0];
            let b31 = b[3 * 4 + 1];
            let b32 = b[3 * 4 + 2];
            let b33 = b[3 * 4 + 3];
            matrix.data.set([
                b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
            ]);
            return matrix;
        }
        /**
         * Computes and returns the inverse of a passed matrix.
         * @param _matrix The matrix to compute the inverse of.
         */
        static INVERSION(_matrix) {
            let m = _matrix.data;
            let m00 = m[0 * 4 + 0];
            let m01 = m[0 * 4 + 1];
            let m02 = m[0 * 4 + 2];
            let m03 = m[0 * 4 + 3];
            let m10 = m[1 * 4 + 0];
            let m11 = m[1 * 4 + 1];
            let m12 = m[1 * 4 + 2];
            let m13 = m[1 * 4 + 3];
            let m20 = m[2 * 4 + 0];
            let m21 = m[2 * 4 + 1];
            let m22 = m[2 * 4 + 2];
            let m23 = m[2 * 4 + 3];
            let m30 = m[3 * 4 + 0];
            let m31 = m[3 * 4 + 1];
            let m32 = m[3 * 4 + 2];
            let m33 = m[3 * 4 + 3];
            let tmp0 = m22 * m33;
            let tmp1 = m32 * m23;
            let tmp2 = m12 * m33;
            let tmp3 = m32 * m13;
            let tmp4 = m12 * m23;
            let tmp5 = m22 * m13;
            let tmp6 = m02 * m33;
            let tmp7 = m32 * m03;
            let tmp8 = m02 * m23;
            let tmp9 = m22 * m03;
            let tmp10 = m02 * m13;
            let tmp11 = m12 * m03;
            let tmp12 = m20 * m31;
            let tmp13 = m30 * m21;
            let tmp14 = m10 * m31;
            let tmp15 = m30 * m11;
            let tmp16 = m10 * m21;
            let tmp17 = m20 * m11;
            let tmp18 = m00 * m31;
            let tmp19 = m30 * m01;
            let tmp20 = m00 * m21;
            let tmp21 = m20 * m01;
            let tmp22 = m00 * m11;
            let tmp23 = m10 * m01;
            let t0 = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
                (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
            let t1 = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
                (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
            let t2 = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
                (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
            let t3 = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
                (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
            let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
            // let matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            matrix.data.set([
                d * t0,
                d * t1,
                d * t2,
                d * t3,
                d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)),
                d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)),
                d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)),
                d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)),
                d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)),
                d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)),
                d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)),
                d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)),
                d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)),
                d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)),
                d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)),
                d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02)) // [15]
            ]);
            return matrix;
        }
        /**
         * Computes and returns a matrix with the given translation, its z-axis pointing directly at the given target,
         * and a minimal angle between its y-axis and the given up-Vector, respetively calculating yaw and pitch.
         */
        static LOOK_AT(_translation, _target, _up = FudgeCore.Vector3.Y()) {
            // const matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            let zAxis = FudgeCore.Vector3.DIFFERENCE(_target, _translation);
            zAxis.normalize();
            let xAxis = FudgeCore.Vector3.NORMALIZATION(FudgeCore.Vector3.CROSS(_up, zAxis));
            let yAxis = FudgeCore.Vector3.NORMALIZATION(FudgeCore.Vector3.CROSS(zAxis, xAxis));
            matrix.data.set([
                xAxis.x, xAxis.y, xAxis.z, 0,
                yAxis.x, yAxis.y, yAxis.z, 0,
                zAxis.x, zAxis.y, zAxis.z, 0,
                _translation.x,
                _translation.y,
                _translation.z,
                1
            ]);
            return matrix;
        }
        /**
         * Computes and returns a matrix with the given translation, its y-axis matching the given up-vector
         * and its z-axis facing towards the given target at a minimal angle, respetively calculating yaw only.
         */
        static SHOW_TO(_translation, _target, _up = FudgeCore.Vector3.Y()) {
            // const matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            let zAxis = FudgeCore.Vector3.DIFFERENCE(_target, _translation);
            zAxis.normalize();
            let xAxis = FudgeCore.Vector3.NORMALIZATION(FudgeCore.Vector3.CROSS(_up, zAxis));
            // let yAxis: Vector3 = Vector3.NORMALIZATION(Vector3.CROSS(zAxis, xAxis));
            zAxis = FudgeCore.Vector3.NORMALIZATION(FudgeCore.Vector3.CROSS(xAxis, _up));
            matrix.data.set([
                xAxis.x, xAxis.y, xAxis.z, 0,
                _up.x, _up.y, _up.z, 0,
                zAxis.x, zAxis.y, zAxis.z, 0,
                _translation.x,
                _translation.y,
                _translation.z,
                1
            ]);
            return matrix;
        }
        /**
         * Returns a matrix that translates coordinates along the x-, y- and z-axis according to the given vector.
         */
        static TRANSLATION(_translate) {
            // let matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            matrix.data.set([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                _translate.x, _translate.y, _translate.z, 1
            ]);
            return matrix;
        }
        /**
         * Returns a matrix that rotates coordinates on the x-axis when multiplied by.
         * @param _angleInDegrees The value of the rotation.
         */
        static ROTATION_X(_angleInDegrees) {
            // const matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            let angleInRadians = _angleInDegrees * Math.PI / 180;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            matrix.data.set([
                1, 0, 0, 0,
                0, cos, sin, 0,
                0, -sin, cos, 0,
                0, 0, 0, 1
            ]);
            return matrix;
        }
        /**
         * Returns a matrix that rotates coordinates on the y-axis when multiplied by.
         * @param _angleInDegrees The value of the rotation.
         */
        static ROTATION_Y(_angleInDegrees) {
            // const matrix: Matrix4x4 = new Matrix4x4;
            let matrix = FudgeCore.Recycler.get(Matrix4x4);
            let angleInRadians = _angleInDegrees * Math.PI / 180;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            matrix.data.set([
                cos, 0, -sin, 0,
                0, 1, 0, 0,
                sin, 0, cos, 0,
                0, 0, 0, 1
            ]);
            return matrix;
        }
        /**
         * Returns a matrix that rotates coordinates on the z-axis when multiplied by.
         * @param _angleInDegrees The value of the rotation.
         */
        static ROTATION_Z(_angleInDegrees) {
            // const matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            let angleInRadians = _angleInDegrees * Math.PI / 180;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            matrix.data.set([
                cos, sin, 0, 0,
                -sin, cos, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
            return matrix;
        }
        /**
         * Returns a matrix that scales coordinates along the x-, y- and z-axis according to the given vector
         */
        static SCALING(_scalar) {
            // const matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            matrix.data.set([
                _scalar.x, 0, 0, 0,
                0, _scalar.y, 0, 0,
                0, 0, _scalar.z, 0,
                0, 0, 0, 1
            ]);
            return matrix;
        }
        /**
         * Returns a representation of the given matrix relative to the given base.
         * If known, pass the inverse of the base to avoid unneccesary calculation
         */
        static RELATIVE(_matrix, _base, _inverse) {
            let result = _inverse ? _inverse : Matrix4x4.INVERSION(_base);
            result = Matrix4x4.MULTIPLICATION(result, _matrix);
            return result;
        }
        //#endregion
        //#region PROJECTIONS
        /**
         * Computes and returns a matrix that applies perspective to an object, if its transform is multiplied by it.
         * @param _aspect The aspect ratio between width and height of projectionspace.(Default = canvas.clientWidth / canvas.ClientHeight)
         * @param _fieldOfViewInDegrees The field of view in Degrees. (Default = 45)
         * @param _near The near clipspace border on the z-axis.
         * @param _far The far clipspace border on the z-axis.
         * @param _direction The plane on which the fieldOfView-Angle is given
         */
        static PROJECTION_CENTRAL(_aspect, _fieldOfViewInDegrees, _near, _far, _direction) {
            //TODO: camera looks down negative z-direction, should be positive
            let fieldOfViewInRadians = _fieldOfViewInDegrees * Math.PI / 180;
            let f = Math.tan(0.5 * (Math.PI - fieldOfViewInRadians));
            let rangeInv = 1.0 / (_near - _far);
            // const matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            matrix.data.set([
                f, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (_near + _far) * rangeInv, -1,
                0, 0, _near * _far * rangeInv * 2, 0
            ]);
            if (_direction == FudgeCore.FIELD_OF_VIEW.DIAGONAL) {
                _aspect = Math.sqrt(_aspect);
                matrix.data[0] = f / _aspect;
                matrix.data[5] = f * _aspect;
            }
            else if (_direction == FudgeCore.FIELD_OF_VIEW.VERTICAL)
                matrix.data[0] = f / _aspect;
            else //FOV_DIRECTION.HORIZONTAL
                matrix.data[5] = f * _aspect;
            // HACK: matrix should look in positive z-direction, preferably the matrix should be calculated like that right away
            matrix.rotateY(180);
            return matrix;
        }
        /**
         * Computes and returns a matrix that applies orthographic projection to an object, if its transform is multiplied by it.
         * @param _left The positionvalue of the projectionspace's left border.
         * @param _right The positionvalue of the projectionspace's right border.
         * @param _bottom The positionvalue of the projectionspace's bottom border.
         * @param _top The positionvalue of the projectionspace's top border.
         * @param _near The positionvalue of the projectionspace's near border.
         * @param _far The positionvalue of the projectionspace's far border
         */
        static PROJECTION_ORTHOGRAPHIC(_left, _right, _bottom, _top, _near = -400, _far = 400) {
            // const matrix: Matrix4x4 = new Matrix4x4;
            const matrix = FudgeCore.Recycler.get(Matrix4x4);
            matrix.data.set([
                2 / (_right - _left), 0, 0, 0,
                0, 2 / (_top - _bottom), 0, 0,
                0, 0, 2 / (_near - _far), 0,
                (_left + _right) / (_left - _right),
                (_bottom + _top) / (_bottom - _top),
                (_near + _far) / (_near - _far),
                1
            ]);
            return matrix;
        }
        //#endregion
        //#region  Accessors
        /**
         * - get: a copy of the calculated translation vector
         * - set: effect the matrix ignoring its rotation and scaling
         */
        get translation() {
            if (!this.vectors.translation) {
                this.vectors.translation = FudgeCore.Recycler.get(FudgeCore.Vector3);
                this.vectors.translation.set(this.data[12], this.data[13], this.data[14]);
            }
            return this.vectors.translation.copy;
        }
        set translation(_translation) {
            this.data.set(_translation.get(), 12);
            // no full cache reset required
            this.vectors.translation = _translation.copy;
            this.mutator = null;
        }
        /**
         * - get: a copy of the calculated rotation vector
         * - set: effect the matrix
         */
        get rotation() {
            if (!this.vectors.rotation)
                this.vectors.rotation = this.getEulerAngles();
            return this.vectors.rotation.copy;
        }
        set rotation(_rotation) {
            this.mutate({ "rotation": _rotation });
            this.resetCache();
        }
        /**
         * - get: a copy of the calculated scale vector
         * - set: effect the matrix
         */
        get scaling() {
            if (!this.vectors.scaling) {
                this.vectors.scaling = FudgeCore.Recycler.get(FudgeCore.Vector3);
                this.vectors.scaling.set(Math.hypot(this.data[0], this.data[1], this.data[2]), Math.hypot(this.data[4], this.data[5], this.data[6]), Math.hypot(this.data[8], this.data[9], this.data[10]));
            }
            return this.vectors.scaling.copy;
        }
        set scaling(_scaling) {
            this.mutate({ "scaling": _scaling });
            this.resetCache();
        }
        /**
         * Return a copy of this
         */
        get copy() {
            let copy = new Matrix4x4();
            copy.set(this);
            return copy;
        }
        //#endregion
        //#region Rotation
        /**
         * Rotate this matrix by given vector in the order Z, Y, X. Right hand rotation is used, thumb points in axis direction, fingers curling indicate rotation
         * The rotation is appended to already applied transforms, thus multiplied from the right. Set _fromLeft to true to switch and put it in front.
         */
        rotate(_by, _fromLeft = false) {
            this.rotateZ(_by.z, _fromLeft);
            this.rotateY(_by.y, _fromLeft);
            this.rotateX(_by.x, _fromLeft);
        }
        /**
         * Adds a rotation around the x-axis to this matrix
         */
        rotateX(_angleInDegrees, _fromLeft = false) {
            let rotation = Matrix4x4.ROTATION_X(_angleInDegrees);
            this.multiply(rotation, _fromLeft);
            FudgeCore.Recycler.store(rotation);
        }
        /**
         * Adds a rotation around the y-axis to this matrix
         */
        rotateY(_angleInDegrees, _fromLeft = false) {
            let rotation = Matrix4x4.ROTATION_Y(_angleInDegrees);
            this.multiply(rotation, _fromLeft);
            FudgeCore.Recycler.store(rotation);
        }
        /**
         * Adds a rotation around the z-axis to this matrix
         */
        rotateZ(_angleInDegrees, _fromLeft = false) {
            let rotation = Matrix4x4.ROTATION_Z(_angleInDegrees);
            this.multiply(rotation, _fromLeft);
            FudgeCore.Recycler.store(rotation);
        }
        /**
         * Adjusts the rotation of this matrix to point the z-axis directly at the given target and tilts it to accord with the given up vector,
         * respectively calculating yaw and pitch. If no up vector is given, the previous up-vector is used.
         * When _preserveScaling is false, a rotated identity matrix is the result.
         */
        lookAt(_target, _up, _preserveScaling = true) {
            if (!_up)
                _up = this.getY();
            const matrix = Matrix4x4.LOOK_AT(this.translation, _target, _up);
            if (_preserveScaling)
                matrix.scale(this.scaling);
            this.set(matrix);
            FudgeCore.Recycler.store(matrix);
        }
        // TODO: testing lookat that really just rotates the matrix rather than creating a new one
        lookAtRotate(_target, _up, _preserveScaling = true) {
            if (!_up)
                _up = this.getY();
            let scaling = this.scaling;
            let difference = FudgeCore.Vector3.DIFFERENCE(_target, this.translation);
            difference.normalize();
            let cos = FudgeCore.Vector3.DOT(FudgeCore.Vector3.NORMALIZATION(this.getZ()), difference);
            let sin = FudgeCore.Vector3.DOT(FudgeCore.Vector3.NORMALIZATION(this.getX()), difference);
            console.log(sin, cos);
            let mtxRotation = FudgeCore.Recycler.borrow(Matrix4x4);
            mtxRotation.data.set([
                cos, 0, -sin, 0,
                0, 1, 0, 0,
                sin, 0, cos, 0,
                0, 0, 0, 1
            ]);
            this.multiply(mtxRotation, false);
            cos = FudgeCore.Vector3.DOT(FudgeCore.Vector3.NORMALIZATION(this.getZ()), difference);
            sin = -FudgeCore.Vector3.DOT(FudgeCore.Vector3.NORMALIZATION(this.getY()), difference);
            console.log(sin, cos);
            mtxRotation.data.set([
                1, 0, 0, 0,
                0, cos, sin, 0,
                0, -sin, cos, 0,
                0, 0, 0, 1
            ]);
            this.multiply(mtxRotation, false);
            this.scaling = scaling;
        }
        /**
         * Adjusts the rotation of this matrix to match its y-axis with the given up-vector and facing its z-axis toward the given target at minimal angle,
         * respectively calculating yaw only. If no up vector is given, the previous up-vector is used.
         * When _preserveScaling is false, a rotated identity matrix is the result.
         */
        showTo(_target, _up, _preserveScaling = true) {
            if (!_up)
                _up = this.getY();
            const matrix = Matrix4x4.SHOW_TO(this.translation, _target, _up);
            if (_preserveScaling)
                matrix.scale(this.scaling);
            this.set(matrix);
            FudgeCore.Recycler.store(matrix);
        }
        //#endregion
        //#region Translation
        /**
         * Add a translation by the given vector to this matrix.
         * If _local is true, translation occurs according to the current rotation and scaling of this matrix,
         * according to the parent otherwise.
         */
        translate(_by, _local = true) {
            if (_local) {
                let translation = Matrix4x4.TRANSLATION(_by);
                this.multiply(translation);
                FudgeCore.Recycler.store(translation);
            }
            else {
                this.data[12] += _by.x;
                this.data[13] += _by.y;
                this.data[14] += _by.z;
                this.mutator = null;
                if (this.vectors.translation)
                    FudgeCore.Recycler.store(this.vectors.translation);
                this.vectors.translation = null;
            }
            // const matrix: Matrix4x4 = Matrix4x4.MULTIPLICATION(this, Matrix4x4.TRANSLATION(_by));
            // // TODO: possible optimization, translation may alter mutator instead of deleting it.
            // this.set(matrix);
            // Recycler.store(matrix);
        }
        /**
         * Add a translation along the x-axis by the given amount to this matrix
         */
        translateX(_x, _local = true) {
            let translation = FudgeCore.Vector3.X(_x);
            this.translate(translation, _local);
            FudgeCore.Recycler.store(translation);
        }
        /**
         * Add a translation along the y-axis by the given amount to this matrix
         */
        translateY(_y, _local = true) {
            let translation = FudgeCore.Vector3.Y(_y);
            this.translate(translation, _local);
            FudgeCore.Recycler.store(translation);
        }
        /**
         * Add a translation along the z-axis by the given amount to this matrix
         */
        translateZ(_z, _local = true) {
            let translation = FudgeCore.Vector3.Z(_z);
            this.translate(translation, _local);
            FudgeCore.Recycler.store(translation);
        }
        //#endregion
        //#region Scaling
        /**
         * Add a scaling by the given vector to this matrix
         */
        scale(_by) {
            const matrix = Matrix4x4.MULTIPLICATION(this, Matrix4x4.SCALING(_by));
            this.set(matrix);
            FudgeCore.Recycler.store(matrix);
        }
        /**
         * Add a scaling along the x-axis by the given amount to this matrix
         */
        scaleX(_by) {
            let vector = FudgeCore.Recycler.borrow(FudgeCore.Vector3);
            vector.set(_by, 1, 1);
            this.scale(vector);
        }
        /**
         * Add a scaling along the y-axis by the given amount to this matrix
         */
        scaleY(_by) {
            let vector = FudgeCore.Recycler.borrow(FudgeCore.Vector3);
            vector.set(1, _by, 1);
            this.scale(vector);
        }
        /**
         * Add a scaling along the z-axis by the given amount to this matrix
         */
        scaleZ(_by) {
            let vector = FudgeCore.Recycler.borrow(FudgeCore.Vector3);
            vector.set(1, 1, _by);
            this.scale(vector);
        }
        //#endregion
        //#region Transformation
        /**
         * Multiply this matrix with the given matrix
         */
        multiply(_matrix, _fromLeft = false) {
            const matrix = _fromLeft ? Matrix4x4.MULTIPLICATION(_matrix, this) : Matrix4x4.MULTIPLICATION(this, _matrix);
            this.set(matrix);
            FudgeCore.Recycler.store(matrix);
        }
        //#endregion
        //#region Transfer
        /**
         * Calculates and returns the euler-angles representing the current rotation of this matrix
         */
        getEulerAngles() {
            let scaling = this.scaling;
            let s0 = this.data[0] / scaling.x;
            let s1 = this.data[1] / scaling.x;
            let s2 = this.data[2] / scaling.x;
            let s6 = this.data[6] / scaling.y;
            let s10 = this.data[10] / scaling.z;
            let sy = Math.hypot(s0, s1); // probably 2. param should be this.data[4] / scaling.y
            let singular = sy < 1e-6; // If
            let x1, y1, z1;
            let x2, y2, z2;
            if (!singular) {
                x1 = Math.atan2(s6, s10);
                y1 = Math.atan2(-s2, sy);
                z1 = Math.atan2(s1, s0);
                x2 = Math.atan2(-s6, -s10);
                y2 = Math.atan2(-s2, -sy);
                z2 = Math.atan2(-s1, -s0);
                if (Math.abs(x2) + Math.abs(y2) + Math.abs(z2) < Math.abs(x1) + Math.abs(y1) + Math.abs(z1)) {
                    x1 = x2;
                    y1 = y2;
                    z1 = z2;
                }
            }
            else {
                x1 = Math.atan2(-this.data[9] / scaling.z, this.data[5] / scaling.y);
                y1 = Math.atan2(-this.data[2] / scaling.x, sy);
                z1 = 0;
            }
            let rotation = FudgeCore.Recycler.get(FudgeCore.Vector3);
            rotation.set(x1, y1, z1);
            rotation.scale(180 / Math.PI);
            return rotation;
        }
        /**
         * Sets the elements of this matrix to the values of the given matrix
         */
        set(_to) {
            // this.data = _to.get();
            this.data.set(_to.data);
            this.resetCache();
        }
        toString() {
            return `ƒ.Matrix4x4(translation: ${this.translation.toString()}, rotation: ${this.rotation.toString()}, scaling: ${this.scaling.toString()}`;
        }
        /**
         * Return the elements of this matrix as a Float32Array
         */
        get() {
            return new Float32Array(this.data);
        }
        /**
         * Return cardinal x-axis
         */
        getX() {
            let result = FudgeCore.Recycler.get(FudgeCore.Vector3);
            result.set(this.data[0], this.data[1], this.data[2]);
            return result;
        }
        /**
         * Return cardinal y-axis
         */
        getY() {
            let result = FudgeCore.Recycler.get(FudgeCore.Vector3);
            result.set(this.data[4], this.data[5], this.data[6]);
            return result;
        }
        /**
         * Return cardinal z-axis
         */
        getZ() {
            let result = FudgeCore.Recycler.get(FudgeCore.Vector3);
            result.set(this.data[8], this.data[9], this.data[10]);
            return result;
        }
        /**
         * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
         */
        swapXY() {
            let temp = [this.data[0], this.data[1], this.data[2]]; // store x-axis
            this.data.set([this.data[4], this.data[5], this.data[6]], 0); // overwrite x-axis with y-axis
            this.data.set(temp, 4); // overwrite Y with temp
            this.data.set([-this.data[8], -this.data[9], -this.data[10]], 8); // reverse z-axis
        }
        /**
         * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
         */
        swapXZ() {
            let temp = [this.data[0], this.data[1], this.data[2]]; // store x-axis
            this.data.set([this.data[8], this.data[9], this.data[10]], 0); // overwrite x-axis with z-axis
            this.data.set(temp, 8); // overwrite Z with temp
            this.data.set([-this.data[4], -this.data[5], -this.data[6]], 4); // reverse y-axis
        }
        /**
         * Swaps the two cardinal axis and reverses the third, effectively rotating the transform 180 degrees around one and 90 degrees around a second axis
         */
        swapYZ() {
            let temp = [this.data[4], this.data[5], this.data[6]]; // store y-axis
            this.data.set([this.data[8], this.data[9], this.data[10]], 4); // overwrite y-axis with z-axis
            this.data.set(temp, 8); // overwrite Z with temp
            this.data.set([-this.data[0], -this.data[1], -this.data[2]], 0); // reverse x-axis
        }
        getTranslationTo(_target) {
            let difference = FudgeCore.Recycler.get(FudgeCore.Vector3);
            difference.set(_target.data[12] - this.data[12], _target.data[13] - this.data[13], _target.data[14] - this.data[14]);
            return difference;
        }
        serialize() {
            // this.getMutator();
            let serialization = {
                translation: this.translation.serialize(),
                rotation: this.rotation.serialize(),
                scaling: this.scaling.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            let mutator = {
                translation: await this.translation.deserialize(_serialization.translation),
                rotation: await this.rotation.deserialize(_serialization.rotation),
                scaling: await this.scaling.deserialize(_serialization.scaling)
            };
            this.mutate(mutator);
            return this;
        }
        getMutator() {
            if (this.mutator)
                return this.mutator;
            let mutator = {
                translation: this.translation.getMutator(),
                rotation: this.rotation.getMutator(),
                scaling: this.scaling.getMutator()
            };
            // cache mutator
            this.mutator = mutator;
            return mutator;
        }
        async mutate(_mutator) {
            let oldTranslation = this.translation;
            let oldRotation = this.rotation;
            let oldScaling = this.scaling;
            let newTranslation = _mutator["translation"];
            let newRotation = _mutator["rotation"];
            let newScaling = _mutator["scaling"];
            let vectors = { translation: oldTranslation, rotation: oldRotation, scaling: oldScaling };
            if (newTranslation) {
                vectors.translation = FudgeCore.Recycler.get(FudgeCore.Vector3);
                vectors.translation.set(newTranslation.x != undefined ? newTranslation.x : oldTranslation.x, newTranslation.y != undefined ? newTranslation.y : oldTranslation.y, newTranslation.z != undefined ? newTranslation.z : oldTranslation.z);
            }
            if (newRotation) {
                vectors.rotation = FudgeCore.Recycler.get(FudgeCore.Vector3);
                vectors.rotation.set(newRotation.x != undefined ? newRotation.x : oldRotation.x, newRotation.y != undefined ? newRotation.y : oldRotation.y, newRotation.z != undefined ? newRotation.z : oldRotation.z);
            }
            if (newScaling) {
                vectors.scaling = FudgeCore.Recycler.get(FudgeCore.Vector3);
                vectors.scaling.set(newScaling.x != undefined ? newScaling.x : oldScaling.x, newScaling.y != undefined ? newScaling.y : oldScaling.y, newScaling.z != undefined ? newScaling.z : oldScaling.z);
            }
            // TODO: possible performance optimization when only one or two components change, then use old matrix instead of IDENTITY and transform by differences/quotients
            let matrix = Matrix4x4.IDENTITY();
            if (vectors.translation)
                matrix.translate(vectors.translation);
            if (vectors.rotation) {
                matrix.rotateZ(vectors.rotation.z);
                matrix.rotateY(vectors.rotation.y);
                matrix.rotateX(vectors.rotation.x);
            }
            if (vectors.scaling)
                matrix.scale(vectors.scaling);
            this.set(matrix);
            this.vectors = vectors;
            FudgeCore.Recycler.store(matrix);
        }
        getMutatorAttributeTypes(_mutator) {
            let types = {};
            if (_mutator.translation)
                types.translation = "Vector3";
            if (_mutator.rotation)
                types.rotation = "Vector3";
            if (_mutator.scaling)
                types.scaling = "Vector3";
            return types;
        }
        reduceMutator(_mutator) { }
        resetCache() {
            this.vectors = { translation: null, rotation: null, scaling: null };
            this.mutator = null;
        }
    }
    FudgeCore.Matrix4x4 = Matrix4x4;
    //#endregion
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Class for creating random values, supporting Javascript's Math.random and a deterministig pseudo-random number generator (PRNG)
     * that can be fed with a seed and then returns a reproducable set of random numbers (if the precision of Javascript allows)
     *
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Random {
        /**
         * Create an instance of [[Random]]. If desired, creates a PRNG with it and feeds the given seed.
         * @param _ownGenerator Default is false
         * @param _seed Default is Math.random()
         */
        constructor(_ownGenerator = false, _seed = Math.random()) {
            this.generate = Math.random;
            if (_ownGenerator)
                this.generate = Random.createGenerator(_seed);
        }
        /**
         * Creates a dererminstic PRNG with the given seed
         */
        static createGenerator(_seed) {
            // TODO: replace with random number generator to generate predictable sequence
            return Math.random;
        }
        /**
         * Returns a normed random number, thus in the range of [0, 1[
         */
        getNorm() {
            return this.generate();
        }
        /**
         * Returns a random number in the range of given [_min, _max[
         */
        getRange(_min, _max) {
            return _min + this.generate() * (_max - _min);
        }
        /**
         * Returns a random integer number in the range of given floored [_min, _max[
         */
        getRangeFloored(_min, _max) {
            return Math.floor(this.getRange(_min, _max));
        }
        /**
         * Returns true or false randomly
         */
        getBoolean() {
            return this.generate() < 0.5;
        }
        /**
         * Returns -1 or 1 randomly
         */
        getSign() {
            return this.getBoolean() ? 1 : -1;
        }
        /**
         * Returns a randomly selected index into the given array
         */
        getIndex(_array) {
            if (_array.length > 0)
                return this.getRangeFloored(0, _array.length);
            return -1;
        }
        /**
         * Removes a randomly selected element from the given array and returns it
         */
        splice(_array) {
            return _array.splice(this.getIndex(_array), 1)[0];
        }
        /**
         * Returns a randomly selected key from the given Map-instance
         */
        getKey(_map) {
            let keys = Array.from(_map.keys());
            return keys[this.getIndex(keys)];
        }
        /**
         * Returns a randomly selected property name from the given object
         */
        getPropertyName(_object) {
            let keys = Object.getOwnPropertyNames(_object);
            return keys[this.getIndex(keys)];
        }
        /**
         * Returns a randomly selected symbol from the given object, if symbols are used as keys
         */
        getPropertySymbol(_object) {
            let keys = Object.getOwnPropertySymbols(_object);
            return keys[this.getIndex(keys)];
        }
    }
    Random.default = new Random();
    FudgeCore.Random = Random;
    /**
     * Standard [[Random]]-instance using Math.random().
     */
    FudgeCore.random = new Random();
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Stores and manipulates a threedimensional vector comprised of the components x, y and z
     * ```plaintext
     *            +y
     *             |__ +x
     *            /
     *          +z
     * ```
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Vector3 extends FudgeCore.Mutable {
        constructor(_x = 0, _y = 0, _z = 0) {
            super();
            this.data = new Float32Array([_x, _y, _z]);
        }
        /**
         * Creates and returns a vector with the given length pointing in x-direction
         */
        static X(_scale = 1) {
            const vector = FudgeCore.Recycler.get(Vector3);
            vector.data.set([_scale, 0, 0]);
            return vector;
        }
        /**
         * Creates and returns a vector with the given length pointing in y-direction
         */
        static Y(_scale = 1) {
            const vector = FudgeCore.Recycler.get(Vector3);
            vector.data.set([0, _scale, 0]);
            return vector;
        }
        /**
         * Creates and returns a vector with the given length pointing in z-direction
         */
        static Z(_scale = 1) {
            const vector = FudgeCore.Recycler.get(Vector3);
            vector.data.set([0, 0, _scale]);
            return vector;
        }
        /**
         * Creates and returns a vector with the value 0 on each axis
         */
        static ZERO() {
            const vector = FudgeCore.Recycler.get(Vector3);
            vector.data.set([0, 0, 0]);
            return vector;
        }
        /**
         * Creates and returns a vector of the given size on each of the three axis
         */
        static ONE(_scale = 1) {
            const vector = FudgeCore.Recycler.get(Vector3);
            vector.data.set([_scale, _scale, _scale]);
            return vector;
        }
        /**
         * Creates and returns a vector through transformation of the given vector by the given matrix
         */
        static TRANSFORMATION(_vector, _matrix, _includeTranslation = true) {
            let result = FudgeCore.Recycler.get(Vector3);
            let m = _matrix.get();
            let [x, y, z] = _vector.get();
            result.x = m[0] * x + m[4] * y + m[8] * z;
            result.y = m[1] * x + m[5] * y + m[9] * z;
            result.z = m[2] * x + m[6] * y + m[10] * z;
            if (_includeTranslation) {
                result.add(_matrix.translation);
            }
            return result;
        }
        /**
         * Creates and returns a vector which is a copy of the given vector scaled to the given length
         */
        static NORMALIZATION(_vector, _length = 1) {
            let magnitude = _vector.magnitude;
            let vector;
            try {
                if (magnitude == 0)
                    throw (new RangeError("Impossible normalization"));
                vector = Vector3.ZERO();
                let factor = _length / _vector.magnitude;
                vector.data = new Float32Array([_vector.x * factor, _vector.y * factor, _vector.z * factor]);
            }
            catch (_error) {
                FudgeCore.Debug.warn(_error);
            }
            return vector;
        }
        /**
         * Returns the resulting vector attained by addition of all given vectors.
         */
        static SUM(..._vectors) {
            let result = FudgeCore.Recycler.get(Vector3);
            for (let vector of _vectors)
                result.data = new Float32Array([result.x + vector.x, result.y + vector.y, result.z + vector.z]);
            return result;
        }
        /**
         * Returns the result of the subtraction of two vectors.
         */
        static DIFFERENCE(_minuend, _subtrahend) {
            let vector = FudgeCore.Recycler.get(Vector3);
            vector.data = new Float32Array([_minuend.x - _subtrahend.x, _minuend.y - _subtrahend.y, _minuend.z - _subtrahend.z]);
            return vector;
        }
        /**
         * Returns a new vector representing the given vector scaled by the given scaling factor
         */
        static SCALE(_vector, _scaling) {
            let scaled = FudgeCore.Recycler.get(Vector3);
            scaled.data = new Float32Array([_vector.x * _scaling, _vector.y * _scaling, _vector.z * _scaling]);
            return scaled;
        }
        /**
         * Computes the crossproduct of 2 vectors.
         */
        static CROSS(_a, _b) {
            let vector = FudgeCore.Recycler.get(Vector3);
            vector.data = new Float32Array([
                _a.y * _b.z - _a.z * _b.y,
                _a.z * _b.x - _a.x * _b.z,
                _a.x * _b.y - _a.y * _b.x
            ]);
            return vector;
        }
        /**
         * Computes the dotproduct of 2 vectors.
         */
        static DOT(_a, _b) {
            let scalarProduct = _a.x * _b.x + _a.y * _b.y + _a.z * _b.z;
            return scalarProduct;
        }
        /**
         * Calculates and returns the reflection of the incoming vector at the given normal vector. The length of normal should be 1.
         *     __________________
         *           /|\
         * incoming / | \ reflection
         *         /  |  \
         *          normal
         *
         */
        static REFLECTION(_incoming, _normal) {
            let dot = -Vector3.DOT(_incoming, _normal);
            let reflection = Vector3.SUM(_incoming, Vector3.SCALE(_normal, 2 * dot));
            return reflection;
        }
        /**
         * Divides the dividend by the divisor component by component and returns the result
         */
        static RATIO(_dividend, _divisor) {
            let vector = FudgeCore.Recycler.get(Vector3);
            vector.data = new Float32Array([_dividend.x / _divisor.x, _dividend.y / _divisor.y, _dividend.z / _divisor.z]);
            return vector;
        }
        // TODO: implement equals-functions
        get x() {
            return this.data[0];
        }
        get y() {
            return this.data[1];
        }
        get z() {
            return this.data[2];
        }
        set x(_x) {
            this.data[0] = _x;
        }
        set y(_y) {
            this.data[1] = _y;
        }
        set z(_z) {
            this.data[2] = _z;
        }
        /**
         * Returns the length of the vector
         */
        get magnitude() {
            return Math.hypot(...this.data);
        }
        /**
         * Returns the square of the magnitude of the vector without calculating a square root. Faster for simple proximity evaluation.
         */
        get magnitudeSquared() {
            return Vector3.DOT(this, this);
        }
        /**
         * Returns a copy of this vector
         */
        get copy() {
            let copy = FudgeCore.Recycler.get(Vector3);
            copy.data.set(this.data);
            return copy;
        }
        /**
         * Returns true if the coordinates of this and the given vector are to be considered identical within the given tolerance
         * TODO: examine, if tolerance as criterium for the difference is appropriate with very large coordinate values or if _tolerance should be multiplied by coordinate value
         */
        equals(_compare, _tolerance = Number.EPSILON) {
            if (Math.abs(this.x - _compare.x) > _tolerance)
                return false;
            if (Math.abs(this.y - _compare.y) > _tolerance)
                return false;
            if (Math.abs(this.z - _compare.z) > _tolerance)
                return false;
            return true;
        }
        /**
         * Returns true if the position described by this is within a cube with the opposite corners 1 and 2
         */
        isInsideCube(_corner1, _corner2) {
            let diagonal = Vector3.DIFFERENCE(_corner2, _corner1);
            let relative = Vector3.DIFFERENCE(this, _corner1);
            let ratio = Vector3.RATIO(relative, diagonal);
            if (ratio.x > 1 || ratio.x < 0)
                return false;
            if (ratio.y > 1 || ratio.y < 0)
                return false;
            if (ratio.z > 1 || ratio.z < 0)
                return false;
            return true;
        }
        /**
         * Returns true if the position described by this is within a sphere with the given center and radius
         */
        isInsideSphere(_center, _radius) {
            let difference = Vector3.DIFFERENCE(this, _center);
            return difference.magnitudeSquared < (_radius * _radius);
        }
        /**
         * Adds the given vector to this
         */
        add(_addend) {
            this.data.set([_addend.x + this.x, _addend.y + this.y, _addend.z + this.z]);
        }
        /**
         * Subtracts the given vector from this
         */
        subtract(_subtrahend) {
            this.data.set([this.x - _subtrahend.x, this.y - _subtrahend.y, this.z - _subtrahend.z]);
        }
        /**
         * Scales this vector by the given scalar
         */
        scale(_scalar) {
            this.data.set([_scalar * this.x, _scalar * this.y, _scalar * this.z]);
        }
        /**
         * Normalizes this to the given length, 1 by default
         */
        normalize(_length = 1) {
            this.data = Vector3.NORMALIZATION(this, _length).data;
        }
        /**
         * Defines the components of this vector with the given numbers
         */
        set(_x = 0, _y = 0, _z = 0) {
            this.data = new Float32Array([_x, _y, _z]);
        }
        /**
         * Returns this vector as a new Float32Array (copy)
         */
        get() {
            return new Float32Array(this.data);
        }
        /**
         * Transforms this vector by the given matrix, including or exluding the translation.
         * Including is the default, excluding will only rotate and scale this vector.
         */
        transform(_matrix, _includeTranslation = true) {
            this.data = Vector3.TRANSFORMATION(this, _matrix, _includeTranslation).data;
        }
        /**
         * Drops the z-component and returns a Vector2 consisting of the x- and y-components
         */
        toVector2() {
            return new FudgeCore.Vector2(this.x, this.y);
        }
        /**
         * Reflects this vector at a given normal. See [[REFLECTION]]
         */
        reflect(_normal) {
            const reflected = Vector3.REFLECTION(this, _normal);
            this.set(reflected.x, reflected.y, reflected.z);
            FudgeCore.Recycler.store(reflected);
        }
        /**
         * Shuffles the components of this vector
         */
        shuffle() {
            let a = Array.from(this.data);
            this.set(FudgeCore.Random.default.splice(a), FudgeCore.Random.default.splice(a), a[0]);
        }
        /**
         * Returns a formatted string representation of this vector
         */
        toString() {
            let result = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)}, ${this.z.toPrecision(5)})`;
            return result;
        }
        /**
         * Uses the standard array.map functionality to perform the given function on all components of this vector
         */
        map(_function) {
            let copy = FudgeCore.Recycler.get(Vector3);
            copy.data = this.data.map(_function);
            return copy;
        }
        //#region Transfer
        serialize() {
            let serialization = this.getMutator();
            // serialization.toJSON = () => { return `{ "r": ${this.r}, "g": ${this.g}, "b": ${this.b}, "a": ${this.a}}`; };
            serialization.toJSON = () => { return `[${this.x}, ${this.y}, ${this.z}]`; };
            return serialization;
        }
        async deserialize(_serialization) {
            if (typeof (_serialization) == "string") {
                [this.x, this.y, this.z] = JSON.parse(_serialization);
            }
            else
                this.mutate(_serialization);
            return this;
        }
        getMutator() {
            let mutator = {
                x: this.data[0], y: this.data[1], z: this.data[2]
            };
            return mutator;
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.Vector3 = Vector3;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    var Mesh_1;
    /**
     * Abstract base class for all meshes.
     * Meshes provide indexed vertices, the order of indices to create trigons and normals, and texture coordinates
     *
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    let Mesh = Mesh_1 = class Mesh extends FudgeCore.Mutable {
        constructor(_name = "Mesh") {
            super();
            this.idResource = undefined;
            this.name = "Mesh";
            this.name = _name;
            FudgeCore.Project.register(this);
        }
        static getBufferSpecification() {
            return { size: 3, dataType: WebGL2RenderingContext.FLOAT, normalize: false, stride: 0, offset: 0 };
        }
        static registerSubclass(_subClass) { return Mesh_1.subclasses.push(_subClass) - 1; }
        get type() {
            return this.constructor.name;
        }
        useRenderBuffers(_shader, _world, _projection, _id) { }
        createRenderBuffers() { }
        deleteRenderBuffers(_shader) { }
        getVertexCount() {
            return this.vertices.length / Mesh_1.getBufferSpecification().size;
        }
        getIndexCount() {
            return this.indices.length;
        }
        create() {
            this.vertices = this.createVertices();
            this.indices = this.createIndices();
            this.textureUVs = this.createTextureUVs();
            this.normalsFace = this.createFaceNormals();
            this.createRenderBuffers();
        }
        // Serialize/Deserialize for all meshes that calculate without parameters
        serialize() {
            let serialization = {
                idResource: this.idResource,
                name: this.name,
                type: this.type // store for editor view
            }; // no data needed ...
            return serialization;
        }
        async deserialize(_serialization) {
            FudgeCore.Project.register(this, _serialization.idResource);
            this.name = _serialization.name;
            // type is an accessor and must not be deserialized
            return this;
        }
        /**Flip the Normals of a Mesh to render opposite side of each polygon*/
        flipNormals() {
            //invertNormals
            for (let n = 0; n < this.normalsFace.length; n++) {
                this.normalsFace[n] = -this.normalsFace[n];
            }
            //flip indices direction
            for (let i = 0; i < this.indices.length - 2; i += 3) {
                let i0 = this.indices[i];
                this.indices[i] = this.indices[i + 1];
                this.indices[i + 1] = i0;
            }
            this.createRenderBuffers();
        }
        // public abstract create(): void;
        calculateFaceNormals() {
            let normals = [];
            let vertices = [];
            for (let v = 0; v < this.vertices.length; v += 3)
                vertices.push(new FudgeCore.Vector3(this.vertices[v], this.vertices[v + 1], this.vertices[v + 2]));
            for (let i = 0; i < this.indices.length; i += 3) {
                let vertex = [this.indices[i], this.indices[i + 1], this.indices[i + 2]];
                let v0 = FudgeCore.Vector3.DIFFERENCE(vertices[vertex[0]], vertices[vertex[1]]);
                let v1 = FudgeCore.Vector3.DIFFERENCE(vertices[vertex[0]], vertices[vertex[2]]);
                let normal = FudgeCore.Vector3.NORMALIZATION(FudgeCore.Vector3.CROSS(v0, v1));
                let index = vertex[2] * 3;
                normals[index] = normal.x;
                normals[index + 1] = normal.y;
                normals[index + 2] = normal.z;
            }
            return new Float32Array(normals);
        }
        reduceMutator(_mutator) {
            // delete _mutator.idResource; 
        }
    };
    /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
    Mesh.baseClass = Mesh_1;
    /** list of all the subclasses derived from this class, if they registered properly*/
    Mesh.subclasses = [];
    Mesh = Mesh_1 = __decorate([
        FudgeCore.RenderInjectorMesh.decorate
    ], Mesh);
    FudgeCore.Mesh = Mesh;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generate a simple cube with edges of length 1, each face consisting of two trigons
     * ```plaintext
     *            4____7
     *           0/__3/|
     *            ||5_||6
     *           1|/_2|/
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class MeshCube extends FudgeCore.Mesh {
        constructor(_name = "MeshCube") {
            super(_name);
            this.create();
        }
        createVertices() {
            let vertices = new Float32Array([
                // First wrap
                // front
                /*0*/ -1, 1, 1, /*1*/ -1, -1, 1, /*2*/ 1, -1, 1, /*3*/ 1, 1, 1,
                // back
                /*4*/ -1, 1, -1, /* 5*/ -1, -1, -1, /* 6*/ 1, -1, -1, /* 7*/ 1, 1, -1,
                // Second wrap
                // front
                /*0*/ -1, 1, 1, /*1*/ -1, -1, 1, /*2*/ 1, -1, 1, /*3*/ 1, 1, 1,
                // back
                /*4*/ -1, 1, -1, /* 5*/ -1, -1, -1, /* 6*/ 1, -1, -1, /* 7*/ 1, 1, -1
            ]);
            // scale down to a length of 1 for all edges
            vertices = vertices.map(_value => _value / 2);
            return vertices;
        }
        createIndices() {
            let indices = new Uint16Array([
                // First wrap
                // front
                1, 2, 0, 2, 3, 0,
                // right
                2, 6, 3, 6, 7, 3,
                // back
                6, 5, 7, 5, 4, 7,
                // Second wrap
                // left
                5 + 8, 1 + 8, 4 + 8, 1 + 8, 0 + 8, 4 + 8,
                // top
                4 + 8, 0 + 8, 3 + 8, 7 + 8, 4 + 8, 3 + 8,
                // bottom
                5 + 8, 6 + 8, 1 + 8, 6 + 8, 2 + 8, 1 + 8
                /*,
                // left
                4, 5, 1, 4, 1, 0,
                // top
                4, 0, 3, 4, 3, 7,
                // bottom
                1, 5, 6, 1, 6, 2
                */
            ]);
            return indices;
        }
        createTextureUVs() {
            let textureUVs = new Float32Array([
                // First wrap
                // front
                /*0*/ 0, 0, /*1*/ 0, 1, /*2*/ 1, 1, /*3*/ 1, 0,
                // back
                /*4*/ 3, 0, /*5*/ 3, 1, /*6*/ 2, 1, /*7*/ 2, 0,
                // Second wrap
                // front
                /*0*/ 1, 0, /*1*/ 1, 1, /*2*/ 1, 2, /*3*/ 1, -1,
                // back
                /*4*/ 0, 0, /*5*/ 0, 1, /*6*/ 0, 2, /*7*/ 0, -1
            ]);
            return textureUVs;
        }
        createFaceNormals() {
            let normals = new Float32Array([
                // for each triangle, the last vertex of the three defining refers to the normalvector when using flat shading
                // First wrap
                // front
                /*0*/ 0, 0, 1, /*1*/ 0, 0, 0, /*2*/ 0, 0, 0, /*3*/ 1, 0, 0,
                // back
                /*4*/ 0, 0, 0, /*5*/ 0, 0, 0, /*6*/ 0, 0, 0, /*7*/ 0, 0, -1,
                // Second wrap
                // front
                /*0*/ 0, 0, 0, /*1*/ 0, -1, 0, /*2*/ 0, 0, 0, /*3*/ 0, 1, 0,
                // back
                /*4*/ -1, 0, 0, /*5*/ 0, 0, 0, /*6*/ 0, 0, 0, /*7*/ 0, 0, 0
            ]);
            //normals = this.createVertices();
            return normals;
        }
    }
    MeshCube.iSubclass = FudgeCore.Mesh.registerSubclass(MeshCube);
    FudgeCore.MeshCube = MeshCube;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generates a planar Grid and applies a Heightmap-Function to it.
     * @authors Jirka Dell'Oro-Friedl, Simon Storl-Schulke, HFU, 2020
     */
    class MeshHeightMap extends FudgeCore.Mesh {
        constructor(_name = "MeshHeightMap", _resolutionX = 16, _resolutionZ = 16, _heightMapFunction) {
            super(_name);
            this.resolutionX = _resolutionX;
            this.resolutionZ = _resolutionZ;
            if (_resolutionZ || _resolutionX <= 0) {
                FudgeCore.Debug.warn("HeightMap Mesh cannot have resolution values < 1. ");
                this.resolutionX = Math.max(1, this.resolutionX);
                this.resolutionZ = Math.max(1, this.resolutionZ);
            }
            if (_heightMapFunction)
                this.heightMapFunction = _heightMapFunction;
            else
                this.heightMapFunction = function (_x, _y) { return 0; };
            this.create();
        }
        createVertices() {
            let vertices = new Float32Array((this.resolutionX + 1) * (this.resolutionZ + 1) * 3);
            //Iterate over each cell to generate grid of vertices
            for (let i = 0, z = 0; z <= this.resolutionZ; z++) {
                for (let x = 0; x <= this.resolutionX; x++) {
                    // X
                    vertices[i] = x / this.resolutionX - 0.5;
                    // Apply heightmap to y coordinate
                    vertices[i + 1] = this.heightMapFunction(x / this.resolutionX, z / this.resolutionZ);
                    // Z
                    vertices[i + 2] = z / this.resolutionZ - 0.5;
                    i += 3;
                }
            }
            return vertices;
        }
        createIndices() {
            let vert = 0;
            let tris = 0;
            let indices = new Uint16Array(this.resolutionX * this.resolutionZ * 6);
            for (let z = 0; z < this.resolutionZ; z++) {
                for (let x = 0; x < this.resolutionX; x++) {
                    // First triangle of each grid-cell
                    indices[tris + 0] = vert + 0;
                    indices[tris + 1] = vert + this.resolutionX + 1;
                    indices[tris + 2] = vert + 1;
                    // Second triangle of each grid-cell
                    indices[tris + 3] = vert + 1;
                    indices[tris + 4] = vert + this.resolutionX + 1;
                    indices[tris + 5] = vert + this.resolutionX + 2;
                    vert++;
                    tris += 6;
                }
                vert++;
            }
            return indices;
        }
        createTextureUVs() {
            let textureUVs = new Float32Array(this.indices.length * 2);
            for (let i = 0, z = 0; z <= this.resolutionZ; z++) {
                for (let x = 0; x <= this.resolutionX; x++) {
                    textureUVs[i] = x / this.resolutionX;
                    textureUVs[i + 1] = z / this.resolutionZ;
                    i += 2;
                }
            }
            return textureUVs;
        }
        createFaceNormals() {
            return this.calculateFaceNormals();
        }
    }
    MeshHeightMap.iSubclass = FudgeCore.Mesh.registerSubclass(MeshHeightMap);
    FudgeCore.MeshHeightMap = MeshHeightMap;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generate a simple pyramid with edges at the base of length 1 and a height of 1. The sides consisting of one, the base of two trigons
     * ```plaintext
     *               4
     *              /\`.
     *            3/__\_\ 2
     *           0/____\/1
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class MeshPyramid extends FudgeCore.Mesh {
        constructor(_name = "MeshPyramid") {
            super(_name);
            this.create();
        }
        createVertices() {
            let vertices = new Float32Array([
                // floor
                /*0*/ -1, 0, 1, /*1*/ 1, 0, 1, /*2*/ 1, 0, -1, /*3*/ -1, 0, -1,
                // tip
                /*4*/ 0, 2, 0,
                // floor again for texturing and normals
                /*5*/ -1, 0, 1, /*6*/ 1, 0, 1, /*7*/ 1, 0, -1, /*8*/ -1, 0, -1
            ]);
            // scale down to a length of 1 for bottom edges and height
            vertices = vertices.map(_value => _value / 2);
            return vertices;
        }
        createIndices() {
            let indices = new Uint16Array([
                // front
                4, 0, 1,
                // right
                4, 1, 2,
                // back
                4, 2, 3,
                // left
                4, 3, 0,
                // bottom
                5 + 0, 5 + 2, 5 + 1, 5 + 0, 5 + 3, 5 + 2
            ]);
            return indices;
        }
        createTextureUVs() {
            let textureUVs = new Float32Array([
                // front
                /*0*/ 0, 1, /*1*/ 0.5, 1, /*2*/ 1, 1, /*3*/ 0.5, 1,
                // back
                /*4*/ 0.5, 0,
                /*5*/ 0, 0, /*6*/ 1, 0, /*7*/ 1, 1, /*8*/ 0, 1
            ]);
            return textureUVs;
        }
        createFaceNormals() {
            return new Float32Array(this.calculateFaceNormals());
        }
    }
    MeshPyramid.iSubclass = FudgeCore.Mesh.registerSubclass(MeshPyramid);
    FudgeCore.MeshPyramid = MeshPyramid;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generate a simple quad with edges of length 1, the face consisting of two trigons
     * ```plaintext
     *        0 __ 3
     *         |__|
     *        1    2
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class MeshQuad extends FudgeCore.Mesh {
        constructor(_name = "MeshQuad") {
            super(_name);
            this.create();
        }
        createVertices() {
            let vertices = new Float32Array([
                /*0*/ -1, 1, 0, /*1*/ -1, -1, 0, /*2*/ 1, -1, 0, /*3*/ 1, 1, 0
            ]);
            vertices = vertices.map(_value => _value / 2);
            return vertices;
        }
        createIndices() {
            let indices = new Uint16Array([
                1, 2, 0, 2, 3, 0
            ]);
            return indices;
        }
        createTextureUVs() {
            let textureUVs = new Float32Array([
                // front
                /*0*/ 0, 0, /*1*/ 0, 1, /*2*/ 1, 1, /*3*/ 1, 0
            ]);
            return textureUVs;
        }
        createFaceNormals() {
            return new Float32Array([
                /*0*/ 0, 0, 1, /*1*/ 0, 0, 0, /*2*/ 0, 0, 0, /*3*/ 0, 0, 0
            ]);
        }
    }
    MeshQuad.iSubclass = FudgeCore.Mesh.registerSubclass(MeshQuad);
    FudgeCore.MeshQuad = MeshQuad;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generate a UV Sphere with a given number of sectors and stacks (clamped at 128*128)
     * Implementation based on http://www.songho.ca/opengl/gl_sphere.html
     * @authors Simon Storl-Schulke, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class MeshSphere extends FudgeCore.Mesh {
        // Dirty Workaround to have access to the normals from createVertices()
        // private normals: Array<number> = [];
        // private textureUVs: Array<number> = [];
        // public textureUVs: Float32Array;
        constructor(_name = "MeshSphere", _sectors = 3, _stacks = 2) {
            super(_name);
            this.create(_sectors, _stacks);
        }
        create(_sectors = 3, _stacks = 2) {
            //Clamp resolution to prevent performance issues
            this.sectors = Math.min(_sectors, 128);
            this.stacks = Math.min(_stacks, 128);
            if (_sectors < 3 || _stacks < 2) {
                FudgeCore.Debug.warn("UV Sphere must have at least 3 sectors and 2 stacks to form a 3-dimensional shape.");
                this.sectors = Math.max(3, _sectors);
                this.stacks = Math.max(2, _stacks);
            }
            let vertices = [];
            let normals = [];
            let textureUVs = [];
            let x;
            let z;
            let xz;
            let y;
            let sectorStep = 2 * Math.PI / this.sectors;
            let stackStep = Math.PI / this.stacks;
            let stackAngle;
            let sectorAngle;
            /* add (sectorCount+1) vertices per stack.
            the first and last vertices have same position and normal,
            but different tex coords */
            for (let i = 0; i <= this.stacks; ++i) {
                stackAngle = Math.PI / 2 - i * stackStep;
                xz = Math.cos(stackAngle);
                y = Math.sin(stackAngle);
                // add (sectorCount+1) vertices per stack
                // the first and last vertices have same position and normal, but different tex coords
                for (let j = 0; j <= this.sectors; ++j) {
                    sectorAngle = j * sectorStep;
                    //vertex position
                    x = xz * Math.cos(sectorAngle);
                    z = xz * Math.sin(sectorAngle);
                    vertices.push(x, y, z);
                    //normals
                    normals.push(x, y, z);
                    //UV Coords
                    textureUVs.push(j / this.sectors * -1);
                    textureUVs.push(i / this.stacks);
                }
            }
            // scale down
            vertices = vertices.map(_value => _value / 2);
            this.textureUVs = new Float32Array(textureUVs);
            this.normals = new Float32Array(normals);
            this.vertices = new Float32Array(vertices);
            this.normalsFace = this.createFaceNormals();
            this.indices = this.createIndices();
            this.createRenderBuffers();
        }
        //#region Transfer
        serialize() {
            let serialization = super.serialize();
            serialization.sectors = this.sectors;
            serialization.stacks = this.stacks;
            return serialization;
        }
        async deserialize(_serialization) {
            super.deserialize(_serialization);
            this.create(_serialization.sectors, _serialization.stacks);
            return this;
        }
        async mutate(_mutator) {
            super.mutate(_mutator);
            let sectors = Math.round(_mutator.sectors);
            let stacks = Math.round(_mutator.stacks);
            this.create(sectors, stacks);
        }
        createIndices() {
            let inds = [];
            let k1;
            let k2;
            for (let i = 0; i < this.stacks; ++i) {
                k1 = i * (this.sectors + 1); // beginning of current stack
                k2 = k1 + this.sectors + 1; // beginning of next stack
                for (let j = 0; j < this.sectors; ++j, ++k1, ++k2) {
                    // 2 triangles per sector excluding first and last stacks
                    // k1 => k2 => k1+1
                    if (i != 0) {
                        inds.push(k1);
                        inds.push(k1 + 1);
                        inds.push(k2);
                    }
                    if (i != (this.stacks - 1)) {
                        inds.push(k1 + 1);
                        inds.push(k2 + 1);
                        inds.push(k2);
                    }
                }
            }
            let indices = new Uint16Array(inds);
            return indices;
        }
        createVertices() {
            return this.vertices;
        }
        createTextureUVs() {
            return this.textureUVs;
        }
        //TODO: we also need REAL face normals
        createFaceNormals() {
            return this.normals;
        }
    }
    MeshSphere.iSubclass = FudgeCore.Mesh.registerSubclass(MeshSphere);
    FudgeCore.MeshSphere = MeshSphere;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generate two quads placed back to back, the one facing in negative Z-direction is textured reversed
     * ```plaintext
     *        0 __ 3
     *         |__|
     *        1    2
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class MeshSprite extends FudgeCore.Mesh {
        constructor(_name = "MeshSprite") {
            super(_name);
            this.create();
        }
        createVertices() {
            let vertices = new Float32Array([
                /*0*/ -1, 1, 0, /*1*/ -1, -1, 0, /*2*/ 1, -1, 0, /*3*/ 1, 1, 0
            ]);
            vertices = vertices.map(_value => _value / 2);
            return vertices;
        }
        createIndices() {
            let indices = new Uint16Array([
                1, 2, 0, 2, 3, 0,
                0, 3, 1, 3, 2, 1 //back
            ]);
            return indices;
        }
        createTextureUVs() {
            let textureUVs = new Float32Array([
                // front
                /*0*/ 0, 0, /*1*/ 0, 1, /*2*/ 1, 1, /*3*/ 1, 0
            ]);
            return textureUVs;
        }
        createFaceNormals() {
            return new Float32Array([
                /*0: normal of front face*/
                0, 0, 1,
                /*1: normal of back face*/
                0, 0, -1,
                /*2*/
                0, 0, 0,
                /*3*/
                0, 0, 0
            ]);
        }
    }
    MeshSprite.iSubclass = FudgeCore.Mesh.registerSubclass(MeshSprite);
    FudgeCore.MeshSprite = MeshSprite;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generate a Torus with a given thickness and the number of major- and minor segments
     * @authors Simon Storl-Schulke, HFU, 2020 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class MeshTorus extends FudgeCore.Mesh {
        constructor(_name = "MeshTorus", _thickness = 0.25, _majorSegments = 32, _minorSegments = 12) {
            super(_name);
            this.thickness = 0.25;
            this.majorSegments = 32;
            this.minorSegments = 12;
            //Clamp resolution to prevent performance issues
            this.majorSegments = Math.min(_majorSegments, 128);
            this.minorSegments = Math.min(_minorSegments, 128);
            if (_majorSegments < 3 || _minorSegments < 3) {
                FudgeCore.Debug.warn("Torus must have at least 3 major and minor segments");
                this.majorSegments = Math.max(3, _majorSegments);
                this.minorSegments = Math.max(3, _minorSegments);
            }
            this.create();
        }
        create() {
            let vertices = [];
            let normals = [];
            let textureUVs = [];
            let centerX;
            let centerY;
            let x, y, z;
            let PI2 = Math.PI * 2;
            for (let j = 0; j <= this.minorSegments; j++) {
                for (let i = 0; i <= this.majorSegments; i++) {
                    let u = i / this.majorSegments * PI2;
                    let v = j / this.minorSegments * PI2;
                    centerX = Math.cos(u);
                    centerY = Math.sin(u);
                    x = (1 + this.thickness * Math.cos(v)) * Math.sin(u);
                    y = this.thickness * Math.sin(v);
                    z = (1 + this.thickness * Math.cos(v)) * Math.cos(u);
                    vertices.push(x, y, z);
                    let normal = new FudgeCore.Vector3(x - centerX, y - centerY, z);
                    normal.normalize();
                    normals.push(normal.x, normal.y, normal.z);
                    textureUVs.push(i / this.majorSegments, j / this.minorSegments);
                }
            }
            // scale down
            vertices = vertices.map(_value => _value / 2);
            this.textureUVs = new Float32Array(textureUVs);
            this.normals = new Float32Array(normals);
            this.vertices = new Float32Array(vertices);
            this.normalsFace = this.createFaceNormals();
            this.indices = this.createIndices();
            this.createRenderBuffers();
        }
        createIndices() {
            let inds = [];
            for (let j = 1; j <= this.minorSegments; j++) {
                for (let i = 1; i <= this.majorSegments; i++) {
                    let a = (this.majorSegments + 1) * j + i - 1;
                    let b = (this.majorSegments + 1) * (j - 1) + i - 1;
                    let c = (this.majorSegments + 1) * (j - 1) + i;
                    let d = (this.majorSegments + 1) * j + i;
                    inds.push(a, b, d, b, c, d);
                }
            }
            let indices = new Uint16Array(inds);
            return indices;
        }
        createVertices() {
            return this.vertices;
        }
        createTextureUVs() {
            return this.textureUVs;
        }
        //TODO: we also need REAL face normals
        createFaceNormals() {
            return this.normals;
        }
    }
    MeshTorus.iSubclass = FudgeCore.Mesh.registerSubclass(MeshTorus);
    FudgeCore.MeshTorus = MeshTorus;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
       * Acts as the physical representation of a connection between two [[Node]]'s.
       * The type of conncetion is defined by the subclasses like prismatic joint, cylinder joint etc.
       * A Rigidbody on the [[Node]] that this component is added to is needed. Setting the connectedRigidbody and
       * initializing the connection creates a physical connection between them. This differs from a connection through hierarchy
       * in the node structure of fudge. Joints can have different DOF's (Degrees Of Freedom), 1 Axis that can either twist or swing is a degree of freedom.
       * A joint typically consists of a motor that limits movement/rotation or is activly trying to move to a limit. And a spring which defines the rigidity.
       * @author Marko Fehrenbach, HFU 2020
       */
    class ComponentJoint extends FudgeCore.Component {
        /** Create a joint connection between the two given RigidbodyComponents. */
        constructor(_attachedRigidbody = null, _connectedRigidbody = null) {
            super();
            this.singleton = false; //Multiple joints can be attached to one Node
            this.idAttachedRB = 0;
            this.idConnectedRB = 0;
            this.connected = false;
            this.attachedRigidbody = _attachedRigidbody;
            this.connectedRigidbody = _connectedRigidbody;
        }
        /** Get/Set the first ComponentRigidbody of this connection. It should always be the one that this component is attached too in the sceneTree. */
        get attachedRigidbody() {
            return this.attachedRB;
        }
        set attachedRigidbody(_cmpRB) {
            this.idAttachedRB = _cmpRB != null ? _cmpRB.id : 0;
            this.attachedRB = _cmpRB;
            this.disconnect();
            this.dirtyStatus();
        }
        /** Get/Set the second ComponentRigidbody of this connection. */
        get connectedRigidbody() {
            return this.connectedRB;
        }
        set connectedRigidbody(_cmpRB) {
            this.idConnectedRB = _cmpRB != null ? _cmpRB.id : 0;
            this.connectedRB = _cmpRB;
            this.disconnect();
            this.dirtyStatus();
        }
        /** Get/Set if the two bodies collide with each other or only with the world but not with themselves. Default = no internal collision.
         *  In most cases it's prefered to declare a minimum and maximum angle/length the bodies can move from one another instead of having them collide.
         */
        get selfCollision() {
            return this.collisionBetweenConnectedBodies;
        }
        set selfCollision(_value) {
            this.collisionBetweenConnectedBodies = _value;
        }
        /** Check if connection is dirty, so when either rb is changed disconnect and reconnect. Internally used no user interaction needed. */
        checkConnection() {
            return this.connected;
        }
        /** Adding the given Fudge ComponentJoint to the oimoPhysics World */
        addConstraintToWorld(cmpJoint) {
            FudgeCore.Physics.world.addJoint(cmpJoint);
        }
        /** Removing the given Fudge ComponentJoint to the oimoPhysics World */
        removeConstraintFromWorld(cmpJoint) {
            FudgeCore.Physics.world.removeJoint(cmpJoint);
        }
        /** Setting both bodies to the bodies that belong to the loaded IDs and reconnecting them */
        setBodiesFromLoadedIDs() {
            FudgeCore.Debug.log("Set From: " + this.idAttachedRB + " / " + this.idConnectedRB);
            this.attachedRigidbody = FudgeCore.Physics.world.getBodyByID(this.idAttachedRB);
            this.connectedRigidbody = FudgeCore.Physics.world.getBodyByID(this.idConnectedRB);
        }
        /** Deserialize Base Class Information - Component, since Typescript does not give the ability to call super.super */
        baseDeserialize(_serialization) {
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        /** Serialize Base Class Information - Component, since Typescript does not give the ability to call super.super in Child classes of e.g. ComponentJointPrismatic */
        baseSerialize() {
            let serialization;
            serialization = super.serialize();
            return serialization;
        }
    }
    ComponentJoint.iSubclass = FudgeCore.Component.registerSubclass(ComponentJoint);
    FudgeCore.ComponentJoint = ComponentJoint;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
       * A physical connection between two bodies with a defined axe of rotation and rotation. Two Degrees of Freedom in the defined axis.
       * Two RigidBodies need to be defined to use it. A motor can be defined for rotation and translation, along with spring settings.
       *
       * ```plaintext
       *          JointHolder - attachedRigidbody
       *                    ----------  ↑
       *                    |        |  |
       *          <---------|        |--------------> connectedRigidbody, sliding on one Axis, 1st Degree of Freedom
       *                    |        |  |
       *                    ----------  ↓ rotating on one Axis, 2nd Degree of Freedom
       * ```
       *
       * @author Marko Fehrenbach, HFU 2020
       */
    class ComponentJointCylindrical extends FudgeCore.ComponentJoint {
        /** Creating a cylindrical joint between two ComponentRigidbodies moving on one axis and rotating around another bound on a local anchorpoint. */
        constructor(_attachedRigidbody = null, _connectedRigidbody = null, _axis = new FudgeCore.Vector3(0, 1, 0), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_attachedRigidbody, _connectedRigidbody);
            //Internal Variables
            this.jointSpringDampingRatio = 0;
            this.jointSpringFrequency = 0;
            this.jointRotationSpringDampingRatio = 0;
            this.jointRotationSpringFrequency = 0;
            this.jointMotorLimitUpper = 10;
            this.jointMotorLimitLower = -10;
            this.jointMotorForce = 0;
            this.jointMotorSpeed = 0;
            this.jointRotationMotorLimitUpper = 360;
            this.jointRotationMotorLimitLower = 0;
            this.jointRotationMotorTorque = 0;
            this.jointRotationMotorSpeed = 0;
            this.jointBreakForce = 0;
            this.jointBreakTorque = 0;
            this.config = new OIMO.CylindricalJointConfig();
            this.jointAxis = new OIMO.Vec3(_axis.x, _axis.y, _axis.z);
            this.jointAnchor = new OIMO.Vec3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
            /*Tell the physics that there is a new joint and on the physics start the actual joint is first created. Values can be set but the
              actual constraint ain't existent until the game starts
            */
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.dirtyStatus);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.superRemove);
        }
        //#region Get/Set transfor of fudge properties to the physics engine
        /**
         * The axis connecting the the two [[Node]]s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get axis() {
            return new FudgeCore.Vector3(this.jointAxis.x, this.jointAxis.y, this.jointAxis.z);
        }
        set axis(_value) {
            this.jointAxis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The exact position where the two [[Node]]s are connected. When changed after initialization the joint needs to be reconnected.
         */
        get anchor() {
            return new FudgeCore.Vector3(this.jointAnchor.x, this.jointAnchor.y, this.jointAnchor.z);
        }
        set anchor(_value) {
            this.jointAnchor = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDamping() {
            return this.jointSpringDampingRatio;
        }
        set springDamping(_value) {
            this.jointSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTranslationalSpringDamper().dampingRatio = this.jointSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequency() {
            return this.jointSpringFrequency;
        }
        set springFrequency(_value) {
            this.jointSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTranslationalSpringDamper().frequency = this.jointSpringFrequency;
        }
        /**
        * The damping of the spring. 1 equals completly damped. Influencing TORQUE / ROTATION
        */
        get rotationSpringDamping() {
            return this.jointRotationSpringDampingRatio;
        }
        set rotationSpringDamping(_value) {
            this.jointRotationSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getRotationalSpringDamper().dampingRatio = this.jointRotationSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. Influencing TORQUE / ROTATION
        */
        get rotationSpringFrequency() {
            return this.jointRotationSpringFrequency;
        }
        set rotationSpringFrequency(_value) {
            this.jointRotationSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getRotationalSpringDamper().frequency = this.jointRotationSpringFrequency;
        }
        /**
         * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default)
        */
        get breakForce() {
            return this.jointBreakForce;
        }
        set breakForce(_value) {
            this.jointBreakForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakForce(this.jointBreakForce);
        }
        /**
           * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default)
          */
        get breakTorque() {
            return this.jointBreakTorque;
        }
        set breakTorque(_value) {
            this.jointBreakTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakTorque(this.jointBreakTorque);
        }
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get rotationalMotorLimitUpper() {
            return this.jointRotationMotorLimitUpper * 180 / Math.PI;
        }
        set rotationalMotorLimitUpper(_value) {
            this.jointRotationMotorLimitUpper = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getRotationalLimitMotor().upperLimit = this.jointRotationMotorLimitUpper;
        }
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get rotationalMotorLimitLower() {
            return this.jointRotationMotorLimitLower * 180 / Math.PI;
        }
        set rotationalMotorLimitLower(_value) {
            this.jointRotationMotorLimitLower = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getRotationalLimitMotor().lowerLimit = this.jointRotationMotorLimitLower;
        }
        /**
          * The target rotational speed of the motor in m/s.
         */
        get rotationalMotorSpeed() {
            return this.jointRotationMotorSpeed;
        }
        set rotationalMotorSpeed(_value) {
            this.jointRotationMotorSpeed = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getRotationalLimitMotor().motorSpeed = this.jointRotationMotorSpeed;
        }
        /**
          * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get rotationalMotorTorque() {
            return this.jointRotationMotorTorque;
        }
        set rotationalMotorTorque(_value) {
            this.jointRotationMotorTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getRotationalLimitMotor().motorTorque = this.jointRotationMotorTorque;
        }
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        get translationMotorLimitUpper() {
            return this.jointMotorLimitUpper;
        }
        set translationMotorLimitUpper(_value) {
            this.jointMotorLimitUpper = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTranslationalLimitMotor().upperLimit = this.jointMotorLimitUpper;
        }
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        get translationMotorLimitLower() {
            return this.jointMotorLimitUpper;
        }
        set translationMotorLimitLower(_value) {
            this.jointMotorLimitLower = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTranslationalLimitMotor().lowerLimit = this.jointMotorLimitLower;
        }
        /**
          * The target speed of the motor in m/s.
         */
        get translationMotorSpeed() {
            return this.jointMotorSpeed;
        }
        set translationMotorSpeed(_value) {
            this.jointMotorSpeed = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTranslationalLimitMotor().motorSpeed = this.jointMotorSpeed;
        }
        /**
          * The maximum motor force in Newton. force <= 0 equals disabled.
         */
        get translationMotorForce() {
            return this.jointMotorForce;
        }
        set translationMotorForce(_value) {
            this.jointMotorForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTranslationalLimitMotor().motorForce = this.jointMotorForce;
        }
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        get internalCollision() {
            return this.jointInternalCollision;
        }
        set internalCollision(_value) {
            this.jointInternalCollision = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setAllowCollision(this.jointInternalCollision);
        }
        //#endregion
        /**
         * Initializing and connecting the two rigidbodies with the configured joint properties
         * is automatically called by the physics system. No user interaction needed.
         */
        connect() {
            if (this.connected == false) {
                this.constructJoint();
                this.connected = true;
                this.superAdd();
            }
        }
        /**
         * Disconnecting the two rigidbodies and removing them from the physics system,
         * is automatically called by the physics system. No user interaction needed.
         */
        disconnect() {
            if (this.connected == true) {
                this.superRemove();
                this.connected = false;
            }
        }
        /**
         * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
         * Only to be used when functionality that is not added within Fudge is needed.
        */
        getOimoJoint() {
            return this.oimoJoint;
        }
        //#region Saving/Loading
        serialize() {
            let serialization = {
                attID: super.idAttachedRB,
                conID: super.idConnectedRB,
                axis: this.axis,
                anchor: this.anchor,
                internalCollision: this.jointInternalCollision,
                springDamping: this.jointSpringDampingRatio,
                springFrequency: this.jointSpringFrequency,
                breakForce: this.jointBreakForce,
                breakTorque: this.jointBreakTorque,
                motorLimitUpper: this.jointMotorLimitUpper,
                motorLimitLower: this.jointMotorLimitLower,
                motorSpeed: this.jointMotorSpeed,
                motorForce: this.jointMotorForce,
                springDampingRotation: this.jointRotationSpringDampingRatio,
                springFrequencyRotation: this.jointRotationSpringFrequency,
                upperLimitRotation: this.jointRotationMotorLimitUpper,
                lowerLimitRotation: this.jointRotationMotorLimitLower,
                motorSpeedRotation: this.jointRotationMotorSpeed,
                motorTorque: this.jointRotationMotorTorque,
                [super.constructor.name]: super.baseSerialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.idAttachedRB = _serialization.attID;
            super.idConnectedRB = _serialization.conID;
            if (_serialization.attID != null && _serialization.conID != null)
                super.setBodiesFromLoadedIDs();
            this.axis = _serialization.axis != null ? _serialization.axis : this.jointAxis;
            this.anchor = _serialization.anchor != null ? _serialization.anchor : this.jointAnchor;
            this.internalCollision = _serialization.internalCollision != null ? _serialization.internalCollision : false;
            this.springDamping = _serialization.springDamping != null ? _serialization.springDamping : this.jointSpringDampingRatio;
            this.springFrequency = _serialization.springFrequency != null ? _serialization.springFrequency : this.jointSpringFrequency;
            this.breakForce = _serialization.breakForce != null ? _serialization.breakForce : this.jointBreakForce;
            this.breakTorque = _serialization.breakTorque != null ? _serialization.breakTorque : this.jointBreakTorque;
            this.translationMotorLimitUpper = _serialization.upperLimitTranslation != null ? _serialization.upperLimitTranslation : this.jointMotorLimitUpper;
            this.translationMotorLimitLower = _serialization.lowerLimitTranslation != null ? _serialization.lowerLimitTranslation : this.jointMotorLimitLower;
            this.translationMotorSpeed = _serialization.motorSpeedTranslation != null ? _serialization.motorSpeedTranslation : this.jointMotorSpeed;
            this.jointMotorForce = _serialization.motorForceTranslation != null ? _serialization.motorForceTranslation : this.jointMotorForce;
            this.rotationSpringDamping = _serialization.springDampingRotation != null ? _serialization.springDampingRotation : this.jointRotationSpringDampingRatio;
            this.rotationSpringFrequency = _serialization.springFrequencyRotation != null ? _serialization.springFrequencyRotation : this.jointRotationSpringFrequency;
            this.rotationalMotorLimitUpper = _serialization.upperLimitRotation != null ? _serialization.upperLimitRotation : this.jointRotationMotorLimitUpper;
            this.rotationalMotorLimitLower = _serialization.lowerLimitRotation != null ? _serialization.lowerLimitRotation : this.jointRotationMotorLimitLower;
            this.rotationalMotorSpeed = _serialization.motorSpeedRotation != null ? _serialization.motorSpeedRotation : this.jointRotationMotorSpeed;
            this.rotationalMotorTorque = _serialization.motorTorque != null ? _serialization.motorTorque : this.jointRotationMotorTorque;
            super.baseDeserialize(_serialization);
            return this;
        }
        //#endregion
        dirtyStatus() {
            FudgeCore.Physics.world.changeJointStatus(this);
        }
        constructJoint() {
            this.springDamper = new OIMO.SpringDamper().setSpring(this.jointSpringFrequency, this.jointSpringDampingRatio);
            this.rotationSpringDamper = new OIMO.SpringDamper().setSpring(this.jointRotationSpringFrequency, this.rotationSpringDamping);
            this.translationMotor = new OIMO.TranslationalLimitMotor().setLimits(this.jointMotorLimitLower, this.jointMotorLimitUpper);
            this.translationMotor.setMotor(this.jointMotorSpeed, this.jointMotorForce);
            this.rotationalMotor = new OIMO.RotationalLimitMotor().setLimits(this.jointRotationMotorLimitLower, this.jointRotationMotorLimitUpper);
            this.rotationalMotor.setMotor(this.jointRotationMotorSpeed, this.jointRotationMotorTorque);
            this.config = new OIMO.CylindricalJointConfig();
            let attachedRBPos = this.attachedRigidbody.getContainer().mtxWorld.translation;
            let worldAnchor = new OIMO.Vec3(attachedRBPos.x + this.jointAnchor.x, attachedRBPos.y + this.jointAnchor.y, attachedRBPos.z + this.jointAnchor.z);
            this.config.init(this.attachedRB.getOimoRigidbody(), this.connectedRB.getOimoRigidbody(), worldAnchor, this.jointAxis);
            this.config.translationalSpringDamper = this.springDamper;
            this.config.translationalLimitMotor = this.translationMotor;
            this.config.rotationalLimitMotor = this.rotationalMotor;
            this.config.rotationalSpringDamper = this.rotationSpringDamper;
            var j = new OIMO.CylindricalJoint(this.config);
            j.setBreakForce(this.breakForce);
            j.setBreakTorque(this.breakTorque);
            j.setAllowCollision(this.jointInternalCollision);
            this.oimoJoint = j;
        }
        superAdd() {
            this.addConstraintToWorld(this);
        }
        superRemove() {
            this.removeConstraintFromWorld(this);
        }
    }
    ComponentJointCylindrical.iSubclass = FudgeCore.Component.registerSubclass(ComponentJointCylindrical);
    FudgeCore.ComponentJointCylindrical = ComponentJointCylindrical;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
       * A physical connection between two bodies with a defined axe movement.
       * Used to create a sliding joint along one axis. Two RigidBodies need to be defined to use it.
       * A motor can be defined to move the connected along the defined axis. Great to construct standard springs or physical sliders.
       *
       * ```plaintext
       *          JointHolder - attachedRigidbody
       *                    --------
       *                    |      |
       *          <---------|      |--------------> connectedRigidbody, sliding on one Axis, 1 Degree of Freedom
       *                    |      |
       *                    --------
       * ```
       * @author Marko Fehrenbach, HFU 2020
       */
    class ComponentJointPrismatic extends FudgeCore.ComponentJoint {
        /** Creating a prismatic joint between two ComponentRigidbodies only moving on one axis bound on a local anchorpoint. */
        constructor(_attachedRigidbody = null, _connectedRigidbody = null, _axis = new FudgeCore.Vector3(0, 1, 0), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_attachedRigidbody, _connectedRigidbody);
            //Internally used variables - Joint Properties that are used even when no actual oimoJoint is currently existend
            this.jointSpringDampingRatio = 0;
            this.jointSpringFrequency = 0;
            this.jointMotorLimitUpper = 10;
            this.jointMotorLimitLower = -10;
            this.jointMotorForce = 0;
            this.jointMotorSpeed = 0;
            this.jointBreakForce = 0;
            this.jointBreakTorque = 0;
            this.config = new OIMO.PrismaticJointConfig();
            this.jointAxis = new OIMO.Vec3(_axis.x, _axis.y, _axis.z);
            this.jointAnchor = new OIMO.Vec3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
            /*Tell the physics that there is a new joint and on the physics start the actual joint is first created. Values can be set but the
              actual constraint ain't existent until the game starts
            */
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.dirtyStatus);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.superRemove);
        }
        //#region Get/Set transfor of fudge properties to the physics engine
        /**
         * The axis connecting the the two [[Node]]s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get axis() {
            return new FudgeCore.Vector3(this.jointAxis.x, this.jointAxis.y, this.jointAxis.z);
        }
        set axis(_value) {
            this.jointAxis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The exact position where the two [[Node]]s are connected. When changed after initialization the joint needs to be reconnected.
         */
        get anchor() {
            return new FudgeCore.Vector3(this.jointAnchor.x, this.jointAnchor.y, this.jointAnchor.z);
        }
        set anchor(_value) {
            this.jointAnchor = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDamping() {
            return this.jointSpringDampingRatio;
        }
        set springDamping(_value) {
            this.jointSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper().dampingRatio = this.jointSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequency() {
            return this.jointSpringFrequency;
        }
        set springFrequency(_value) {
            this.jointSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper().frequency = this.jointSpringFrequency;
        }
        /**
         * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default)
        */
        get breakForce() {
            return this.jointBreakForce;
        }
        set breakForce(_value) {
            this.jointBreakForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakForce(this.jointBreakForce);
        }
        /**
           * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default)
          */
        get breakTorque() {
            return this.jointBreakTorque;
        }
        set breakTorque(_value) {
            this.jointBreakTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakTorque(this.jointBreakTorque);
        }
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        get motorLimitUpper() {
            return this.jointMotorLimitUpper;
        }
        set motorLimitUpper(_value) {
            this.jointMotorLimitUpper = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().upperLimit = this.jointMotorLimitUpper;
        }
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit.
         */
        get motorLimitLower() {
            return this.jointMotorLimitLower;
        }
        set motorLimitLower(_value) {
            this.jointMotorLimitLower = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().lowerLimit = this.jointMotorLimitLower;
        }
        /**
          * The target speed of the motor in m/s.
         */
        get motorSpeed() {
            return this.jointMotorSpeed;
        }
        set motorSpeed(_value) {
            this.jointMotorSpeed = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().motorSpeed = this.jointMotorSpeed;
        }
        /**
          * The maximum motor force in Newton. force <= 0 equals disabled. This is the force that the motor is using to hold the position, or reach it if a motorSpeed is defined.
         */
        get motorForce() {
            return this.jointMotorForce;
        }
        set motorForce(_value) {
            this.jointMotorForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().motorForce = this.jointMotorForce;
        }
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        get internalCollision() {
            return this.jointInternalCollision;
        }
        set internalCollision(_value) {
            this.jointInternalCollision = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setAllowCollision(this.jointInternalCollision);
        }
        //#endregion
        /**
         * Initializing and connecting the two rigidbodies with the configured joint properties
         * is automatically called by the physics system. No user interaction needed.
         */
        connect() {
            if (this.connected == false) {
                this.constructJoint();
                this.connected = true;
                this.superAdd();
                FudgeCore.Debug.log("called Connection For: " + this.attachedRB.getContainer().name + " / " + this.connectedRB.getContainer().name);
                FudgeCore.Debug.log("Strength: " + this.springDamping + " / " + this.springFrequency);
                FudgeCore.Debug.log(this.oimoJoint);
            }
        }
        /**
         * Disconnecting the two rigidbodies and removing them from the physics system,
         * is automatically called by the physics system. No user interaction needed.
         */
        disconnect() {
            if (this.connected == true) {
                this.superRemove();
                this.connected = false;
            }
        }
        /**
         * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
         * Only to be used when functionality that is not added within Fudge is needed.
        */
        getOimoJoint() {
            return this.oimoJoint;
        }
        //#region Saving/Loading
        serialize() {
            let serialization = {
                attID: super.idAttachedRB,
                conID: super.idConnectedRB,
                axis: this.axis,
                anchor: this.anchor,
                internalCollision: this.jointInternalCollision,
                springDamping: this.jointSpringDampingRatio,
                springFrequency: this.jointSpringFrequency,
                breakForce: this.jointBreakForce,
                breakTorque: this.jointBreakTorque,
                motorLimitUpper: this.jointMotorLimitUpper,
                motorLimitLower: this.jointMotorLimitLower,
                motorSpeed: this.jointMotorSpeed,
                motorForce: this.jointMotorForce,
                [super.constructor.name]: super.baseSerialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.idAttachedRB = _serialization.attID;
            super.idConnectedRB = _serialization.conID;
            if (_serialization.attID != null && _serialization.conID != null)
                super.setBodiesFromLoadedIDs();
            this.axis = _serialization.axis != null ? _serialization.axis : this.jointAxis;
            this.anchor = _serialization.anchor != null ? _serialization.anchor : this.jointAnchor;
            this.internalCollision = _serialization.internalCollision != null ? _serialization.internalCollision : false;
            this.springDamping = _serialization.springDamping != null ? _serialization.springDamping : this.jointSpringDampingRatio;
            this.springFrequency = _serialization.springFrequency != null ? _serialization.springFrequency : this.jointSpringFrequency;
            this.breakForce = _serialization.breakForce != null ? _serialization.breakForce : this.jointBreakForce;
            this.breakTorque = _serialization.breakTorque != null ? _serialization.breakTorque : this.jointBreakTorque;
            this.motorLimitUpper = _serialization.motorLimitUpper != null ? _serialization.motorLimitUpper : this.jointMotorLimitUpper;
            this.motorLimitLower = _serialization.motorLimitLower != null ? _serialization.motorLimitLower : this.jointMotorLimitLower;
            this.motorSpeed = _serialization.motorSpeed != null ? _serialization.motorSpeed : this.jointMotorSpeed;
            this.motorForce = _serialization.motorForce != null ? _serialization.motorForce : this.jointMotorForce;
            super.baseDeserialize(_serialization); //Super, Super, Component != ComponentJoint
            return this;
        }
        //#endregion
        /** Tell the FudgePhysics system that this joint needs to be handled in the next frame. */
        dirtyStatus() {
            FudgeCore.Debug.log("Dirty Status");
            FudgeCore.Physics.world.changeJointStatus(this);
        }
        /** Actual creation of a joint in the OimoPhysics system */
        constructJoint() {
            this.springDamper = new OIMO.SpringDamper().setSpring(this.jointSpringFrequency, this.jointSpringDampingRatio); //Create spring settings, either as a spring or totally rigid
            this.translationalMotor = new OIMO.TranslationalLimitMotor().setLimits(this.jointMotorLimitLower, this.jointMotorLimitUpper); //Create motor settings, to hold positions, set constraint min/max
            this.translationalMotor.setMotor(this.jointMotorSpeed, this.jointMotorForce);
            this.config = new OIMO.PrismaticJointConfig(); //Create a specific config for this joint type that is calculating the local axis for both bodies
            let attachedRBPos = this.attachedRigidbody.getContainer().mtxWorld.translation; //Setting the anchor position locally from the first rigidbody
            let worldAnchor = new OIMO.Vec3(attachedRBPos.x + this.jointAnchor.x, attachedRBPos.y + this.jointAnchor.y, attachedRBPos.z + this.jointAnchor.z);
            this.config.init(this.attachedRB.getOimoRigidbody(), this.connectedRB.getOimoRigidbody(), worldAnchor, this.jointAxis); //Initialize the config to calculate the local axis/anchors for the OimoPhysics Engine
            this.config.springDamper = this.springDamper; //Telling the config to use the motor/spring of the Fudge Component
            this.config.limitMotor = this.translationalMotor;
            var j = new OIMO.PrismaticJoint(this.config); //Creating the specific type of joint
            j.setBreakForce(this.breakForce); //Set additional infos, if the joint is unbreakable and colliding internally
            j.setBreakTorque(this.breakTorque);
            j.setAllowCollision(this.jointInternalCollision);
            this.oimoJoint = j; //Tell the Fudge Component which joint in the OimoPhysics system it represents
        }
        /** Adding this joint to the world through the general function of the base class ComponentJoint. Happening when the joint is connecting.  */
        superAdd() {
            this.addConstraintToWorld(this);
        }
        /** Removing this joint to the world through the general function of the base class ComponentJoint. Happening when this component is removed from the Node. */
        superRemove() {
            this.removeConstraintFromWorld(this);
        }
    }
    ComponentJointPrismatic.iSubclass = FudgeCore.Component.registerSubclass(ComponentJointPrismatic);
    FudgeCore.ComponentJointPrismatic = ComponentJointPrismatic;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
        * A physical connection between two bodies, designed to simulate behaviour within a real body. It has two axis, a swing and twist axis, and also the perpendicular axis,
        * similar to a Spherical joint, but more restrictive in it's angles and only two degrees of freedom. Two RigidBodies need to be defined to use it. Mostly used to create humanlike joints that behave like a
        * lifeless body.
        * ```plaintext
        *
        *                      anchor - it can twist on one axis and swing on another
        *         z                   |
        *         ↑            -----  |  ------------
        *         |           |     | ↓ |            |        e.g. z = TwistAxis, it can rotate in-itself around this axis
        *  -x <---|---> x     |     | x |            |        e.g. x = SwingAxis, it can rotate anchored around the base on this axis
        *         |           |     |   |            |
        *         ↓            -----     ------------         e.g. you can twist the leg in-itself to a certain degree,
        *        -z                                           but also rotate it forward/backward/left/right to a certain degree
        *                attachedRB          connectedRB
        *              (e.g. upper-leg)         (e.g. pelvis)
        *
        * ```
        * Twist equals a rotation around a point without moving on an axis.
        * Swing equals a rotation on a point with a moving local axis.
        * @author Marko Fehrenbach, HFU, 2020
        */
    class ComponentJointRagdoll extends FudgeCore.ComponentJoint {
        constructor(_attachedRigidbody = null, _connectedRigidbody = null, _firstAxis = new FudgeCore.Vector3(1, 0, 0), _secondAxis = new FudgeCore.Vector3(0, 0, 1), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_attachedRigidbody, _connectedRigidbody);
            this.jointTwistSpringDampingRatio = 0;
            this.jointTwistSpringFrequency = 0;
            this.jointSwingSpringDampingRatio = 0;
            this.jointSwingSpringFrequency = 0;
            this.jointTwistMotorLimitUpper = 360;
            this.jointTwistMotorLimitLower = 0;
            this.jointTwistMotorTorque = 0;
            this.jointTwistMotorSpeed = 0;
            this.jointBreakForce = 0;
            this.jointBreakTorque = 0;
            this.config = new OIMO.RagdollJointConfig();
            this.jointFirstAxis = new OIMO.Vec3(_firstAxis.x, _firstAxis.y, _firstAxis.z);
            this.jointSecondAxis = new OIMO.Vec3(_secondAxis.x, _secondAxis.y, _secondAxis.z);
            this.jointAnchor = new OIMO.Vec3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
            /*Tell the physics that there is a new joint and on the physics start the actual joint is first created. Values can be set but the
              actual constraint ain't existent until the game starts
            */
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.dirtyStatus);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.superRemove);
        }
        //#region Get/Set transfor of fudge properties to the physics engine
        /**
         * The axis connecting the the two [[Node]]s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get firstAxis() {
            return new FudgeCore.Vector3(this.jointFirstAxis.x, this.jointFirstAxis.y, this.jointFirstAxis.z);
        }
        set firstAxis(_value) {
            this.jointFirstAxis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
        * The axis connecting the the two [[Node]]s e.g. Vector3(0,1,0) to have a upward connection.
        *  When changed after initialization the joint needs to be reconnected.
        */
        get secondAxis() {
            return new FudgeCore.Vector3(this.jointSecondAxis.x, this.jointSecondAxis.y, this.jointSecondAxis.z);
        }
        set secondAxis(_value) {
            this.jointSecondAxis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The exact position where the two [[Node]]s are connected. When changed after initialization the joint needs to be reconnected.
         */
        get anchor() {
            return new FudgeCore.Vector3(this.jointAnchor.x, this.jointAnchor.y, this.jointAnchor.z);
        }
        set anchor(_value) {
            this.jointAnchor = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The maximum angle of rotation along the first axis. Value needs to be positive. Changes do rebuild the joint
         */
        get maxAngleFirstAxis() {
            return this.jointMaxAngle1 * 180 / Math.PI;
        }
        set maxAngleFirstAxis(_value) {
            this.jointMaxAngle1 = _value * Math.PI / 180;
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The maximum angle of rotation along the second axis. Value needs to be positive. Changes do rebuild the joint
         */
        get maxAngleSecondAxis() {
            return this.jointMaxAngle2 * 180 / Math.PI;
        }
        set maxAngleSecondAxis(_value) {
            this.jointMaxAngle2 = _value * Math.PI / 180;
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingTwist() {
            return this.jointTwistSpringDampingRatio;
        }
        set springDampingTwist(_value) {
            this.jointTwistSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTwistSpringDamper().dampingRatio = this.jointTwistSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencyTwist() {
            return this.jointTwistSpringFrequency;
        }
        set springFrequencyTwist(_value) {
            this.jointTwistSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTwistSpringDamper().frequency = this.jointTwistSpringFrequency;
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingSwing() {
            return this.jointSwingSpringDampingRatio;
        }
        set springDampingSwing(_value) {
            this.jointSwingSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSwingSpringDamper().dampingRatio = this.jointSwingSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencySwing() {
            return this.jointSwingSpringFrequency;
        }
        set springFrequencySwing(_value) {
            this.jointSwingSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSwingSpringDamper().frequency = this.jointSwingSpringFrequency;
        }
        /**
         * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default)
        */
        get breakForce() {
            return this.jointBreakForce;
        }
        set breakForce(_value) {
            this.jointBreakForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakForce(this.jointBreakForce);
        }
        /**
           * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default)
          */
        get breakTorque() {
            return this.jointBreakTorque;
        }
        set breakTorque(_value) {
            this.jointBreakTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakTorque(this.jointBreakTorque);
        }
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get twistMotorLimitUpper() {
            return this.jointTwistMotorLimitUpper * 180 / Math.PI;
        }
        set twistMotorLimitUpper(_value) {
            this.jointTwistMotorLimitUpper = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getTwistLimitMotor().upperLimit = this.jointTwistMotorLimitUpper;
        }
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get twistMotorLimitLower() {
            return this.jointTwistMotorLimitLower * 180 / Math.PI;
        }
        set twistMotorLimitLower(_value) {
            this.jointTwistMotorLimitLower = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getTwistLimitMotor().lowerLimit = this.jointTwistMotorLimitLower;
        }
        /**
          * The target rotational speed of the motor in m/s.
         */
        get twistMotorSpeed() {
            return this.jointTwistMotorSpeed;
        }
        set twistMotorSpeed(_value) {
            this.jointTwistMotorSpeed = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTwistLimitMotor().motorSpeed = this.jointTwistMotorSpeed;
        }
        /**
          * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get twistMotorTorque() {
            return this.twistMotorTorque;
        }
        set twistMotorTorque(_value) {
            this.twistMotorTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getTwistLimitMotor().motorTorque = this.twistMotorTorque;
        }
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        get internalCollision() {
            return this.jointInternalCollision;
        }
        set internalCollision(_value) {
            this.jointInternalCollision = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setAllowCollision(this.jointInternalCollision);
        }
        //#endregion
        /**
         * Initializing and connecting the two rigidbodies with the configured joint properties
         * is automatically called by the physics system. No user interaction needed.
         */
        connect() {
            if (this.connected == false) {
                this.constructJoint();
                this.connected = true;
                this.superAdd();
            }
        }
        /**
         * Disconnecting the two rigidbodies and removing them from the physics system,
         * is automatically called by the physics system. No user interaction needed.
         */
        disconnect() {
            if (this.connected == true) {
                this.superRemove();
                this.connected = false;
            }
        }
        /**
         * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
         * Only to be used when functionality that is not added within Fudge is needed.
        */
        getOimoJoint() {
            return this.oimoJoint;
        }
        //#region Saving/Loading
        serialize() {
            let serialization = {
                attID: super.idAttachedRB,
                conID: super.idConnectedRB,
                anchor: this.anchor,
                internalCollision: this.jointInternalCollision,
                breakForce: this.jointBreakForce,
                breakTorque: this.jointBreakTorque,
                firstAxis: this.jointFirstAxis,
                secondAxis: this.jointSecondAxis,
                maxAngleFirstAxis: this.jointMaxAngle1,
                maxAngleSecondAxis: this.jointMaxAngle2,
                springDampingTwist: this.jointTwistSpringDampingRatio,
                springFrequencyTwist: this.jointTwistSpringFrequency,
                springDampingSwing: this.jointSwingSpringDampingRatio,
                springFrequencySwing: this.jointSwingSpringFrequency,
                twistMotorLimitUpper: this.jointTwistMotorLimitUpper,
                twistMotorLimitLower: this.jointTwistMotorLimitLower,
                twistMotorSpeed: this.twistMotorSpeed,
                twistMotorTorque: this.twistMotorTorque,
                [super.constructor.name]: super.baseSerialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.idAttachedRB = _serialization.attID;
            super.idConnectedRB = _serialization.conID;
            if (_serialization.attID != null && _serialization.conID != null)
                super.setBodiesFromLoadedIDs();
            this.anchor = _serialization.anchor != null ? _serialization.anchor : this.jointAnchor;
            this.internalCollision = _serialization.internalCollision != null ? _serialization.internalCollision : false;
            this.breakForce = _serialization.breakForce != null ? _serialization.breakForce : this.jointBreakForce;
            this.breakTorque = _serialization.breakTorque != null ? _serialization.breakTorque : this.jointBreakTorque;
            this.firstAxis = _serialization.firstAxis != null ? _serialization.firstAxis : this.jointFirstAxis;
            this.secondAxis = _serialization.secondAxis != null ? _serialization.secondAxis : this.jointSecondAxis;
            this.maxAngleFirstAxis = _serialization.maxAngleFirstAxis != null ? _serialization.maxAngleFirstAxis : this.jointMaxAngle1;
            this.maxAngleSecondAxis = _serialization.maxAngleSecondAxis != null ? _serialization.maxAngleSecondAxis : this.jointMaxAngle2;
            this.springDampingTwist = _serialization.springDampingTwist != null ? _serialization.springDampingTwist : this.jointTwistSpringDampingRatio;
            this.springFrequencyTwist = _serialization.springFrequencyTwist != null ? _serialization.springFrequencyTwist : this.jointTwistSpringFrequency;
            this.springDampingSwing = _serialization.springDampingSwing != null ? _serialization.springDampingSwing : this.jointSwingSpringDampingRatio;
            this.springFrequencySwing = _serialization.springFrequencySwing != null ? _serialization.springFrequencySwing : this.jointSwingSpringFrequency;
            this.twistMotorLimitUpper = _serialization.twistMotorLimitUpper != null ? _serialization.twistMotorLimitUpper : this.jointTwistMotorLimitUpper;
            this.twistMotorLimitLower = _serialization.twistMotorLimitLower != null ? _serialization.twistMotorLimitLower : this.jointTwistMotorLimitLower;
            this.twistMotorSpeed = _serialization.twistMotorSpeed != null ? _serialization.twistMotorSpeed : this.jointTwistMotorSpeed;
            this.twistMotorTorque = _serialization.twistMotorTorque != null ? _serialization.twistMotorTorque : this.jointTwistMotorTorque;
            super.baseDeserialize(_serialization);
            return this;
        }
        //#endregion
        dirtyStatus() {
            FudgeCore.Physics.world.changeJointStatus(this);
        }
        constructJoint() {
            this.jointTwistSpringDamper = new OIMO.SpringDamper().setSpring(this.jointTwistSpringFrequency, this.jointTwistSpringDampingRatio);
            this.jointSwingSpringDamper = new OIMO.SpringDamper().setSpring(this.jointSwingSpringFrequency, this.jointSwingSpringDampingRatio);
            this.jointTwistMotor = new OIMO.RotationalLimitMotor().setLimits(this.jointTwistMotorLimitLower, this.jointTwistMotorLimitUpper);
            this.jointTwistMotor.setMotor(this.jointTwistMotorSpeed, this.jointTwistMotorTorque);
            this.config = new OIMO.RagdollJointConfig();
            let attachedRBPos = this.attachedRigidbody.getContainer().mtxWorld.translation;
            let worldAnchor = new OIMO.Vec3(attachedRBPos.x + this.jointAnchor.x, attachedRBPos.y + this.jointAnchor.y, attachedRBPos.z + this.jointAnchor.z);
            this.config.init(this.attachedRB.getOimoRigidbody(), this.connectedRB.getOimoRigidbody(), worldAnchor, this.jointFirstAxis, this.jointSecondAxis);
            this.config.swingSpringDamper = this.jointSwingSpringDamper;
            this.config.twistSpringDamper = this.jointTwistSpringDamper;
            this.config.twistLimitMotor = this.jointTwistMotor;
            this.config.maxSwingAngle1 = this.jointMaxAngle1;
            this.config.maxSwingAngle2 = this.jointMaxAngle2;
            var j = new OIMO.RagdollJoint(this.config);
            j.setBreakForce(this.breakForce);
            j.setBreakTorque(this.breakTorque);
            j.setAllowCollision(this.jointInternalCollision);
            this.oimoJoint = j;
        }
        superAdd() {
            this.addConstraintToWorld(this);
        }
        superRemove() {
            this.removeConstraintFromWorld(this);
        }
    }
    ComponentJointRagdoll.iSubclass = FudgeCore.Component.registerSubclass(ComponentJointRagdoll);
    FudgeCore.ComponentJointRagdoll = ComponentJointRagdoll;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
       * A physical connection between two bodies with a defined axe of rotation. Also known as HINGE joint.
       * Two RigidBodies need to be defined to use it. A motor can be defined to rotate the connected along the defined axis.
       *
       * ```plaintext
       *                  rotation axis, 1st Degree of freedom
       *                    ↑
       *              ---   |   ------------
       *             |   |  |  |            |
       *             |   |  |  |            |
       *             |   |  |  |            |
       *              ---   |   ------------
       *      attachedRB    ↓    connectedRB
       *   (e.g. Doorhinge)       (e.g. Door)
       * ```
       * @author Marko Fehrenbach, HFU, 2020
       */
    class ComponentJointRevolute extends FudgeCore.ComponentJoint {
        constructor(_attachedRigidbody = null, _connectedRigidbody = null, _axis = new FudgeCore.Vector3(0, 1, 0), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_attachedRigidbody, _connectedRigidbody);
            this.jointSpringDampingRatio = 0;
            this.jointSpringFrequency = 0;
            this.jointMotorLimitUpper = 360;
            this.jointMotorLimitLower = 0;
            this.jointmotorTorque = 0;
            this.jointMotorSpeed = 0;
            this.jointBreakForce = 0;
            this.jointBreakTorque = 0;
            this.config = new OIMO.RevoluteJointConfig();
            this.jointAxis = new OIMO.Vec3(_axis.x, _axis.y, _axis.z);
            this.jointAnchor = new OIMO.Vec3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
            /*Tell the physics that there is a new joint and on the physics start the actual joint is first created. Values can be set but the
             actual constraint ain't existent until the game starts
           */
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.dirtyStatus);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.superRemove);
        }
        //#region Get/Set transfor of fudge properties to the physics engine
        /**
         * The axis connecting the the two [[Node]]s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get axis() {
            return new FudgeCore.Vector3(this.jointAxis.x, this.jointAxis.y, this.jointAxis.z);
        }
        set axis(_value) {
            this.jointAxis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The exact position where the two [[Node]]s are connected. When changed after initialization the joint needs to be reconnected.
         */
        get anchor() {
            return new FudgeCore.Vector3(this.jointAnchor.x, this.jointAnchor.y, this.jointAnchor.z);
        }
        set anchor(_value) {
            this.jointAnchor = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDamping() {
            return this.jointSpringDampingRatio;
        }
        set springDamping(_value) {
            this.jointSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper().dampingRatio = this.jointSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequency() {
            return this.jointSpringFrequency;
        }
        set springFrequency(_value) {
            this.jointSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper().frequency = this.jointSpringFrequency;
        }
        /**
         * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default)
        */
        get breakForce() {
            return this.jointBreakForce;
        }
        set breakForce(_value) {
            this.jointBreakForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakForce(this.jointBreakForce);
        }
        /**
           * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default)
          */
        get breakTorque() {
            return this.jointBreakTorque;
        }
        set breakTorque(_value) {
            this.jointBreakTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakTorque(this.jointBreakTorque);
        }
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get motorLimitUpper() {
            return this.jointMotorLimitUpper * 180 / Math.PI;
        }
        set motorLimitUpper(_value) {
            this.jointMotorLimitUpper = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().upperLimit = this.jointMotorLimitUpper;
        }
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get motorLimitLower() {
            return this.jointMotorLimitLower * 180 / Math.PI;
        }
        set motorLimitLower(_value) {
            this.jointMotorLimitLower = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().lowerLimit = this.jointMotorLimitLower;
        }
        /**
          * The target speed of the motor in m/s.
         */
        get motorSpeed() {
            return this.jointMotorSpeed;
        }
        set motorSpeed(_value) {
            this.jointMotorSpeed = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().motorSpeed = this.jointMotorSpeed;
        }
        /**
          * The maximum motor force in Newton. force <= 0 equals disabled.
         */
        get motorTorque() {
            return this.jointmotorTorque;
        }
        set motorTorque(_value) {
            this.jointmotorTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor().motorTorque = this.jointmotorTorque;
        }
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        get internalCollision() {
            return this.jointInternalCollision;
        }
        set internalCollision(_value) {
            this.jointInternalCollision = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setAllowCollision(this.jointInternalCollision);
        }
        //#endregion
        /**
         * Initializing and connecting the two rigidbodies with the configured joint properties
         * is automatically called by the physics system. No user interaction needed.
         */
        connect() {
            if (this.connected == false) {
                this.constructJoint();
                this.connected = true;
                this.superAdd();
            }
        }
        /**
         * Disconnecting the two rigidbodies and removing them from the physics system,
         * is automatically called by the physics system. No user interaction needed.
         */
        disconnect() {
            if (this.connected == true) {
                this.superRemove();
                this.connected = false;
            }
        }
        /**
         * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
         * Only to be used when functionality that is not added within Fudge is needed.
        */
        getOimoJoint() {
            return this.oimoJoint;
        }
        //#region Saving/Loading
        serialize() {
            let serialization = {
                attID: super.idAttachedRB,
                conID: super.idConnectedRB,
                axis: this.axis,
                anchor: this.anchor,
                internalCollision: this.jointInternalCollision,
                springDamping: this.jointSpringDampingRatio,
                springFrequency: this.jointSpringFrequency,
                breakForce: this.jointBreakForce,
                breakTorque: this.jointBreakTorque,
                motorLimitUpper: this.jointMotorLimitUpper,
                motorLimitLower: this.jointMotorLimitLower,
                motorSpeed: this.jointMotorSpeed,
                motorTorque: this.jointmotorTorque,
                [super.constructor.name]: super.baseSerialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.idAttachedRB = _serialization.attID;
            super.idConnectedRB = _serialization.conID;
            if (_serialization.attID != null && _serialization.conID != null)
                super.setBodiesFromLoadedIDs();
            this.axis = _serialization.axis != null ? _serialization.axis : this.jointAxis;
            this.anchor = _serialization.anchor != null ? _serialization.anchor : this.jointAnchor;
            this.internalCollision = _serialization.internalCollision != null ? _serialization.internalCollision : false;
            this.springDamping = _serialization.springDamping != null ? _serialization.springDamping : this.jointSpringDampingRatio;
            this.springFrequency = _serialization.springFrequency != null ? _serialization.springFrequency : this.jointSpringFrequency;
            this.breakForce = _serialization.breakForce != null ? _serialization.breakForce : this.jointBreakForce;
            this.breakTorque = _serialization.breakTorque != null ? _serialization.breakTorque : this.jointBreakTorque;
            this.motorLimitUpper = _serialization.upperLimit != null ? _serialization.upperLimit : this.jointMotorLimitUpper;
            this.motorLimitLower = _serialization.lowerLimit != null ? _serialization.lowerLimit : this.jointMotorLimitLower;
            this.motorSpeed = _serialization.motorSpeed != null ? _serialization.motorSpeed : this.jointMotorSpeed;
            this.motorTorque = _serialization.motorForce != null ? _serialization.motorForce : this.jointmotorTorque;
            super.baseDeserialize(_serialization);
            return this;
        }
        //#endregion
        dirtyStatus() {
            FudgeCore.Physics.world.changeJointStatus(this);
        }
        constructJoint() {
            this.springDamper = new OIMO.SpringDamper().setSpring(this.jointSpringFrequency, this.jointSpringDampingRatio);
            this.rotationalMotor = new OIMO.RotationalLimitMotor().setLimits(this.jointMotorLimitLower, this.jointMotorLimitUpper);
            this.rotationalMotor.setMotor(this.jointMotorSpeed, this.jointmotorTorque);
            this.config = new OIMO.RevoluteJointConfig();
            let attachedRBPos = this.attachedRigidbody.getContainer().mtxWorld.translation;
            let worldAnchor = new OIMO.Vec3(attachedRBPos.x + this.jointAnchor.x, attachedRBPos.y + this.jointAnchor.y, attachedRBPos.z + this.jointAnchor.z);
            this.config.init(this.attachedRB.getOimoRigidbody(), this.connectedRB.getOimoRigidbody(), worldAnchor, this.jointAxis);
            this.config.springDamper = this.springDamper;
            this.config.limitMotor = this.rotationalMotor;
            var j = new OIMO.RevoluteJoint(this.config);
            j.setBreakForce(this.breakForce);
            j.setBreakTorque(this.breakTorque);
            j.setAllowCollision(this.jointInternalCollision);
            this.oimoJoint = j;
        }
        superAdd() {
            this.addConstraintToWorld(this);
        }
        superRemove() {
            this.removeConstraintFromWorld(this);
        }
    }
    ComponentJointRevolute.iSubclass = FudgeCore.Component.registerSubclass(ComponentJointRevolute);
    FudgeCore.ComponentJointRevolute = ComponentJointRevolute;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
       * A physical connection between two bodies with three Degrees of Freedom, also known as ball and socket joint. Two bodies connected at their anchor but free to rotate.
       * Used for things like the connection of bones in the human shoulder (if simplified, else better use JointRagdoll). Two RigidBodies need to be defined to use it. Only spring settings can be defined.
       * 3 Degrees are swing horizontal, swing vertical and twist.
       *
       * ```plaintext
       *              JointHolder - attachedRigidbody (e.g. Human-Shoulder)
       *         z                             -------
       *      y  ↑                            |      |
       *        \|            ----------------|      |
       *  -x <---|---> x     |                |      |
       *         |\           ----------------|      |
       *         ↓ -y       conntectedRb      |      |
       *        -z         (e.g. Upper-Arm)    -------
       * ```
       * @authors Marko Fehrenbach, HFU, 2020
       */
    class ComponentJointSpherical extends FudgeCore.ComponentJoint {
        constructor(_attachedRigidbody = null, _connectedRigidbody = null, _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_attachedRigidbody, _connectedRigidbody);
            this.jointSpringDampingRatio = 0;
            this.jointSpringFrequency = 0;
            this.jointBreakForce = 0;
            this.jointBreakTorque = 0;
            this.config = new OIMO.SphericalJointConfig();
            this.jointAnchor = new OIMO.Vec3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
            /*Tell the physics that there is a new joint and on the physics start the actual joint is first created. Values can be set but the
             actual constraint ain't existent until the game starts
           */
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.dirtyStatus);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.superRemove);
        }
        //#region Get/Set transfor of fudge properties to the physics engine
        /**
    
        /**
         * The exact position where the two [[Node]]s are connected. When changed after initialization the joint needs to be reconnected.
         */
        get anchor() {
            return new FudgeCore.Vector3(this.jointAnchor.x, this.jointAnchor.y, this.jointAnchor.z);
        }
        set anchor(_value) {
            this.jointAnchor = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDamping() {
            return this.jointSpringDampingRatio;
        }
        set springDamping(_value) {
            this.jointSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper().dampingRatio = this.jointSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequency() {
            return this.jointSpringFrequency;
        }
        set springFrequency(_value) {
            this.jointSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper().frequency = this.jointSpringFrequency;
        }
        /**
         * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default)
        */
        get breakForce() {
            return this.jointBreakForce;
        }
        set breakForce(_value) {
            this.jointBreakForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakForce(this.jointBreakForce);
        }
        /**
           * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default)
          */
        get breakTorque() {
            return this.jointBreakTorque;
        }
        set breakTorque(_value) {
            this.jointBreakTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakTorque(this.jointBreakTorque);
        }
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        get internalCollision() {
            return this.jointInternalCollision;
        }
        set internalCollision(_value) {
            this.jointInternalCollision = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setAllowCollision(this.jointInternalCollision);
        }
        //#endregion
        /**
         * Initializing and connecting the two rigidbodies with the configured joint properties
         * is automatically called by the physics system. No user interaction needed.
         */
        connect() {
            if (this.connected == false) {
                this.constructJoint();
                this.connected = true;
                this.superAdd();
            }
        }
        /**
         * Disconnecting the two rigidbodies and removing them from the physics system,
         * is automatically called by the physics system. No user interaction needed.
         */
        disconnect() {
            if (this.connected == true) {
                this.superRemove();
                this.connected = false;
            }
        }
        /**
         * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
         * Only to be used when functionality that is not added within Fudge is needed.
        */
        getOimoJoint() {
            return this.oimoJoint;
        }
        //#region Saving/Loading
        serialize() {
            let serialization = {
                attID: super.idAttachedRB,
                conID: super.idConnectedRB,
                anchor: this.anchor,
                internalCollision: this.jointInternalCollision,
                springDamping: this.jointSpringDampingRatio,
                springFrequency: this.jointSpringFrequency,
                breakForce: this.jointBreakForce,
                breakTorque: this.jointBreakTorque,
                [super.constructor.name]: super.baseSerialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.idAttachedRB = _serialization.attID;
            super.idConnectedRB = _serialization.conID;
            if (_serialization.attID != null && _serialization.conID != null)
                super.setBodiesFromLoadedIDs();
            this.anchor = _serialization.anchor != null ? _serialization.anchor : this.jointAnchor;
            this.internalCollision = _serialization.internalCollision != null ? _serialization.internalCollision : false;
            this.springDamping = _serialization.springDamping != null ? _serialization.springDamping : this.jointSpringDampingRatio;
            this.springFrequency = _serialization.springFrequency != null ? _serialization.springFrequency : this.jointSpringFrequency;
            this.breakForce = _serialization.breakForce != null ? _serialization.breakForce : this.jointBreakForce;
            this.breakTorque = _serialization.breakTorque != null ? _serialization.breakTorque : this.jointBreakTorque;
            super.baseDeserialize(_serialization);
            return this;
        }
        //#endregion
        dirtyStatus() {
            FudgeCore.Physics.world.changeJointStatus(this);
        }
        constructJoint() {
            this.springDamper = new OIMO.SpringDamper().setSpring(this.jointSpringFrequency, this.jointSpringDampingRatio);
            this.config = new OIMO.SphericalJointConfig();
            let attachedRBPos = this.attachedRigidbody.getContainer().mtxWorld.translation;
            let worldAnchor = new OIMO.Vec3(attachedRBPos.x + this.jointAnchor.x, attachedRBPos.y + this.jointAnchor.y, attachedRBPos.z + this.jointAnchor.z);
            this.config.init(this.attachedRB.getOimoRigidbody(), this.connectedRB.getOimoRigidbody(), worldAnchor);
            this.config.springDamper = this.springDamper;
            var j = new OIMO.SphericalJoint(this.config);
            j.setBreakForce(this.breakForce);
            j.setBreakTorque(this.breakTorque);
            j.setAllowCollision(this.jointInternalCollision);
            this.oimoJoint = j;
        }
        superAdd() {
            this.addConstraintToWorld(this);
        }
        superRemove() {
            this.removeConstraintFromWorld(this);
        }
    }
    ComponentJointSpherical.iSubclass = FudgeCore.Component.registerSubclass(ComponentJointSpherical);
    FudgeCore.ComponentJointSpherical = ComponentJointSpherical;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
       * A physical connection between two bodies with two defined axis (normally e.g. (0,0,1) and rotation(1,0,0)), they share the same anchor and have free rotation, but transfer the twist.
       * In reality used in cars to transfer the more stable stationary force on the velocity axis to the bumping, damped moving wheel. Two RigidBodies need to be defined to use it.
       * The two motors can be defined for the two rotation axis, along with springs.
       * ```plaintext
       *
       *                      anchor - twist is transfered between bodies
       *         z                   |
       *         ↑            -----  |  ------------
       *         |           |     | ↓ |            |
       *  -x <---|---> x     |     | x |            |           e.g. wheel can still turn up/down,
       *         |           |     |   |            |           left right but transfering it's rotation on to the wheel-axis.
       *         ↓            -----     ------------
       *        -z
       *                 attachedRB          connectedRB
       *                (e.g. wheel)       (e.g. wheel-axis)
       * ```
       * @author Marko Fehrenbach, HFU 2020
       */
    class ComponentJointUniversal extends FudgeCore.ComponentJoint {
        constructor(_attachedRigidbody = null, _connectedRigidbody = null, _firstAxis = new FudgeCore.Vector3(1, 0, 0), _secondAxis = new FudgeCore.Vector3(0, 0, 1), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_attachedRigidbody, _connectedRigidbody);
            this.jointFirstSpringDampingRatio = 0;
            this.jointFirstSpringFrequency = 0;
            this.jointSecondSpringDampingRatio = 0;
            this.jointSecondSpringFrequency = 0;
            this.jointFirstMotorLimitUpper = 360;
            this.jointFirstMotorLimitLower = 0;
            this.jointFirstMotorTorque = 0;
            this.jointFirstMotorSpeed = 0;
            this.jointSecondMotorLimitUpper = 360;
            this.jointSecondMotorLimitLower = 0;
            this.jointSecondMotorTorque = 0;
            this.jointSecondMotorSpeed = 0;
            this.jointBreakForce = 0;
            this.jointBreakTorque = 0;
            this.config = new OIMO.UniversalJointConfig();
            this.jointFirstAxis = new OIMO.Vec3(_firstAxis.x, _firstAxis.y, _firstAxis.z);
            this.jointSecondAxis = new OIMO.Vec3(_secondAxis.x, _secondAxis.y, _secondAxis.z);
            this.jointAnchor = new OIMO.Vec3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
            /*Tell the physics that there is a new joint and on the physics start the actual joint is first created. Values can be set but the
              actual constraint ain't existent until the game starts
            */
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.dirtyStatus);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.superRemove);
        }
        //#region Get/Set transfor of fudge properties to the physics engine
        /**
         * The axis connecting the the two [[Node]]s e.g. Vector3(0,1,0) to have a upward connection.
         *  When changed after initialization the joint needs to be reconnected.
         */
        get firstAxis() {
            return new FudgeCore.Vector3(this.jointFirstAxis.x, this.jointFirstAxis.y, this.jointFirstAxis.z);
        }
        set firstAxis(_value) {
            this.jointFirstAxis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
        * The axis connecting the the two [[Node]]s e.g. Vector3(0,1,0) to have a upward connection.
        *  When changed after initialization the joint needs to be reconnected.
        */
        get secondAxis() {
            return new FudgeCore.Vector3(this.jointSecondAxis.x, this.jointSecondAxis.y, this.jointSecondAxis.z);
        }
        set secondAxis(_value) {
            this.jointSecondAxis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The exact position where the two [[Node]]s are connected. When changed after initialization the joint needs to be reconnected.
         */
        get anchor() {
            return new FudgeCore.Vector3(this.jointAnchor.x, this.jointAnchor.y, this.jointAnchor.z);
        }
        set anchor(_value) {
            this.jointAnchor = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingFirstAxis() {
            return this.jointFirstSpringDampingRatio;
        }
        set springDampingFirstAxis(_value) {
            this.jointFirstSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper1().dampingRatio = this.jointFirstSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencyFirstAxis() {
            return this.jointFirstSpringFrequency;
        }
        set springFrequencyFirstAxis(_value) {
            this.jointFirstSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper1().frequency = this.jointFirstSpringFrequency;
        }
        /**
         * The damping of the spring. 1 equals completly damped.
         */
        get springDampingSecondAxis() {
            return this.jointSecondSpringDampingRatio;
        }
        set springDampingSecondAxis(_value) {
            this.jointSecondSpringDampingRatio = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper2().dampingRatio = this.jointSecondSpringDampingRatio;
        }
        /**
         * The frequency of the spring in Hz. At 0 the spring is rigid, equals no spring. The smaller the value the less restrictive is the spring.
        */
        get springFrequencySecondAxis() {
            return this.jointSecondSpringFrequency;
        }
        set springFrequencySecondAxis(_value) {
            this.jointSecondSpringFrequency = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getSpringDamper2().frequency = this.jointSecondSpringFrequency;
        }
        /**
         * The amount of force needed to break the JOINT, in Newton. 0 equals unbreakable (default)
        */
        get breakForce() {
            return this.jointBreakForce;
        }
        set breakForce(_value) {
            this.jointBreakForce = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakForce(this.jointBreakForce);
        }
        /**
           * The amount of force needed to break the JOINT, while rotating, in Newton. 0 equals unbreakable (default)
          */
        get breakTorque() {
            return this.jointBreakTorque;
        }
        set breakTorque(_value) {
            this.jointBreakTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setBreakTorque(this.jointBreakTorque);
        }
        /**
          * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
         */
        get motorLimitUpperFirstAxis() {
            return this.jointFirstMotorLimitUpper * 180 / Math.PI;
        }
        set motorLimitUpperFirstAxis(_value) {
            this.jointFirstMotorLimitUpper = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor1().upperLimit = this.jointFirstMotorLimitUpper;
        }
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get motorLimitLowerFirstAxis() {
            return this.jointFirstMotorLimitLower * 180 / Math.PI;
        }
        set motorLimitLowerFirstAxis(_value) {
            this.jointFirstMotorLimitLower = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor1().lowerLimit = this.jointFirstMotorLimitLower;
        }
        /**
          * The target rotational speed of the motor in m/s.
         */
        get motorSpeedFirstAxis() {
            return this.jointFirstMotorSpeed;
        }
        set motorSpeedFirstAxis(_value) {
            this.jointFirstMotorSpeed = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor1().motorSpeed = this.jointFirstMotorSpeed;
        }
        /**
          * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get motorTorqueFirstAxis() {
            return this.jointFirstMotorTorque;
        }
        set motorTorqueFirstAxis(_value) {
            this.jointFirstMotorTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor1().motorTorque = this.jointFirstMotorTorque;
        }
        /**
        * The Upper Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis-Angle measured in Degree.
       */
        get motorLimitUpperSecondAxis() {
            return this.jointSecondMotorLimitUpper * 180 / Math.PI;
        }
        set motorLimitUpperSecondAxis(_value) {
            this.jointSecondMotorLimitUpper = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor2().upperLimit = this.jointSecondMotorLimitUpper;
        }
        /**
          * The Lower Limit of movement along the axis of this joint. The limiter is disable if lowerLimit > upperLimit. Axis Angle measured in Degree.
         */
        get motorLimitLowerSecondAxis() {
            return this.jointSecondMotorLimitLower * 180 / Math.PI;
        }
        set motorLimitLowerSecondAxis(_value) {
            this.jointSecondMotorLimitLower = _value * Math.PI / 180;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor2().lowerLimit = this.jointSecondMotorLimitLower;
        }
        /**
          * The target rotational speed of the motor in m/s.
         */
        get motorSpeedSecondAxis() {
            return this.jointSecondMotorSpeed;
        }
        set motorSpeedSecondAxis(_value) {
            this.jointSecondMotorSpeed = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor2().motorSpeed = this.jointSecondMotorSpeed;
        }
        /**
          * The maximum motor torque in Newton. force <= 0 equals disabled.
         */
        get motorTorqueSecondAxis() {
            return this.jointSecondMotorTorque;
        }
        set motorTorqueSecondAxis(_value) {
            this.jointSecondMotorTorque = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.getLimitMotor2().motorTorque = this.jointSecondMotorTorque;
        }
        /**
          * If the two connected RigidBodies collide with eath other. (Default = false)
         */
        get internalCollision() {
            return this.jointInternalCollision;
        }
        set internalCollision(_value) {
            this.jointInternalCollision = _value;
            if (this.oimoJoint != null)
                this.oimoJoint.setAllowCollision(this.jointInternalCollision);
        }
        //#endregion
        /**
         * Initializing and connecting the two rigidbodies with the configured joint properties
         * is automatically called by the physics system. No user interaction needed.
         */
        connect() {
            if (this.connected == false) {
                this.constructJoint();
                this.connected = true;
                this.superAdd();
            }
        }
        /**
         * Disconnecting the two rigidbodies and removing them from the physics system,
         * is automatically called by the physics system. No user interaction needed.
         */
        disconnect() {
            if (this.connected == true) {
                this.superRemove();
                this.connected = false;
            }
        }
        /**
         * Returns the original Joint used by the physics engine. Used internally no user interaction needed.
         * Only to be used when functionality that is not added within Fudge is needed.
        */
        getOimoJoint() {
            return this.oimoJoint;
        }
        //#region Saving/Loading
        serialize() {
            let serialization = {
                attID: super.idAttachedRB,
                conID: super.idConnectedRB,
                anchor: this.anchor,
                internalCollision: this.jointInternalCollision,
                breakForce: this.jointBreakForce,
                breakTorque: this.jointBreakTorque,
                firstAxis: this.jointFirstAxis,
                secondAxis: this.jointSecondAxis,
                springDampingFirstAxis: this.jointFirstSpringDampingRatio,
                springFrequencyFirstAxis: this.jointFirstSpringFrequency,
                springDampingSecondAxis: this.jointSecondSpringDampingRatio,
                springFrequencySecondAxis: this.jointSecondSpringFrequency,
                motorLimitUpperFirstAxis: this.jointFirstMotorLimitUpper,
                motorLimitLowerFirstAxis: this.jointFirstMotorLimitLower,
                motorSpeedFirstAxis: this.jointFirstMotorSpeed,
                motorTorqueFirstAxis: this.jointFirstMotorTorque,
                motorLimitUpperSecondAxis: this.jointSecondMotorLimitUpper,
                motorLimitLowerSecondAxis: this.jointSecondMotorLimitLower,
                motorSpeedSecondAxis: this.jointSecondMotorSpeed,
                motorTorqueSecondAxis: this.jointSecondMotorTorque,
                [super.constructor.name]: super.baseSerialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.idAttachedRB = _serialization.attID;
            super.idConnectedRB = _serialization.conID;
            if (_serialization.attID != null && _serialization.conID != null)
                super.setBodiesFromLoadedIDs();
            this.anchor = _serialization.anchor != null ? _serialization.anchor : this.jointAnchor;
            this.internalCollision = _serialization.internalCollision != null ? _serialization.internalCollision : false;
            this.breakForce = _serialization.breakForce != null ? _serialization.breakForce : this.jointBreakForce;
            this.breakTorque = _serialization.breakTorque != null ? _serialization.breakTorque : this.jointBreakTorque;
            this.firstAxis = _serialization.firstAxis != null ? _serialization.firstAxis : this.jointFirstAxis;
            this.secondAxis = _serialization.secondAxis != null ? _serialization.secondAxis : this.jointSecondAxis;
            this.springDampingFirstAxis = _serialization.springDampingFirstAxis != null ? _serialization.springDampingFirstAxis : this.jointFirstSpringDampingRatio;
            this.springFrequencyFirstAxis = _serialization.springFrequencyFirstAxis != null ? _serialization.springFrequencyFirstAxis : this.jointFirstSpringFrequency;
            this.springDampingSecondAxis = _serialization.springDampingSecondAxis != null ? _serialization.springDampingSecondAxis : this.jointSecondSpringDampingRatio;
            this.springFrequencySecondAxis = _serialization.springFrequencySecondAxis != null ? _serialization.springFrequencySecondAxis : this.jointSecondSpringFrequency;
            this.motorLimitUpperFirstAxis = _serialization.motorLimitUpperFirstAxis != null ? _serialization.motorLimitUpperFirstAxis : this.jointFirstMotorLimitUpper;
            this.motorLimitLowerFirstAxis = _serialization.motorLimitLowerFirstAxis != null ? _serialization.motorLimitLowerFirstAxis : this.jointFirstMotorLimitUpper;
            this.motorSpeedFirstAxis = _serialization.motorSpeedFirstAxis != null ? _serialization.motorSpeedFirstAxis : this.jointFirstMotorSpeed;
            this.motorTorqueFirstAxis = _serialization.motorTorqueFirstAxis != null ? _serialization.motorTorqueFirstAxis : this.jointFirstMotorTorque;
            this.motorLimitUpperSecondAxis = _serialization.motorLimitUpperSecondAxis != null ? _serialization.motorLimitUpperSecondAxis : this.jointSecondMotorLimitUpper;
            this.motorLimitLowerSecondAxis = _serialization.motorLimitLowerSecondAxis != null ? _serialization.motorLimitLowerSecondAxis : this.jointSecondMotorLimitUpper;
            this.motorSpeedSecondAxis = _serialization.motorSpeedSecondAxis != null ? _serialization.motorSpeedSecondAxis : this.jointSecondMotorSpeed;
            this.motorTorqueSecondAxis = _serialization.motorTorqueSecondAxis != null ? _serialization.motorTorqueSecondAxis : this.jointSecondMotorTorque;
            super.baseDeserialize(_serialization);
            return this;
        }
        //#endregion
        dirtyStatus() {
            FudgeCore.Physics.world.changeJointStatus(this);
        }
        constructJoint() {
            this.firstAxisSpringDamper = new OIMO.SpringDamper().setSpring(this.jointFirstSpringFrequency, this.jointFirstSpringDampingRatio);
            this.secondAxisSpringDamper = new OIMO.SpringDamper().setSpring(this.jointSecondSpringFrequency, this.jointSecondSpringDampingRatio);
            this.firstAxisMotor = new OIMO.RotationalLimitMotor().setLimits(this.jointFirstMotorLimitLower, this.jointFirstMotorLimitUpper);
            this.firstAxisMotor.setMotor(this.jointFirstMotorSpeed, this.jointFirstMotorTorque);
            this.secondAxisMotor = new OIMO.RotationalLimitMotor().setLimits(this.jointFirstMotorLimitLower, this.jointFirstMotorLimitUpper);
            this.secondAxisMotor.setMotor(this.jointFirstMotorSpeed, this.jointFirstMotorTorque);
            this.config = new OIMO.UniversalJointConfig();
            let attachedRBPos = this.attachedRigidbody.getContainer().mtxWorld.translation;
            let worldAnchor = new OIMO.Vec3(attachedRBPos.x + this.jointAnchor.x, attachedRBPos.y + this.jointAnchor.y, attachedRBPos.z + this.jointAnchor.z);
            this.config.init(this.attachedRB.getOimoRigidbody(), this.connectedRB.getOimoRigidbody(), worldAnchor, this.jointFirstAxis, this.jointSecondAxis);
            this.config.limitMotor1 = this.firstAxisMotor;
            this.config.limitMotor2 = this.secondAxisMotor;
            this.config.springDamper1 = this.firstAxisSpringDamper;
            this.config.springDamper2 = this.secondAxisSpringDamper;
            var j = new OIMO.UniversalJoint(this.config);
            j.setBreakForce(this.breakForce);
            j.setBreakTorque(this.breakTorque);
            j.setAllowCollision(this.jointInternalCollision);
            this.oimoJoint = j;
        }
        superAdd() {
            this.addConstraintToWorld(this);
        }
        superRemove() {
            this.removeConstraintFromWorld(this);
        }
    }
    ComponentJointUniversal.iSubclass = FudgeCore.Component.registerSubclass(ComponentJointUniversal);
    FudgeCore.ComponentJointUniversal = ComponentJointUniversal;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
       * Acts as the physical representation of the [[Node]] it's attached to.
       * It's the connection between the Fudge Rendered world and the Physics world.
       * For the physics to correctly get the transformations rotations need to be applied with from left = true.
       * Or rotations need to happen before scaling.
       * @author Marko Fehrenbach, HFU 2020
       */
    class ComponentRigidbody extends FudgeCore.Component {
        /** Creating a new rigidbody with a weight in kg, a physics type (default = dynamic), a collider type what physical form has the collider, to what group does it belong, is there a transform Matrix that should be used, and is the collider defined as a group of points that represent a convex mesh. */
        constructor(_mass = 1, _type = FudgeCore.PHYSICS_TYPE.DYNAMIC, _colliderType = FudgeCore.COLLIDER_TYPE.CUBE, _group = FudgeCore.Physics.settings.defaultCollisionGroup, _transform = null, _convexMesh = null) {
            super();
            /** The pivot of the physics itself. Default the pivot is identical to the transform. It's used like an offset. */
            this.pivot = FudgeCore.Matrix4x4.IDENTITY();
            /** Collisions with rigidbodies happening to this body, can be used to build a custom onCollisionStay functionality. */
            this.collisions = new Array();
            /** Triggers that are currently triggering this body */
            this.triggers = new Array();
            /** Bodies that trigger this "trigger", only happening if this body is a trigger */
            this.bodiesInTrigger = new Array();
            /** ID to reference this specific ComponentRigidbody */
            this.id = 0;
            this.massData = new OIMO.MassData();
            this.rigidbodyInfo = new OIMO.RigidBodyConfig();
            this.rbType = FudgeCore.PHYSICS_TYPE.DYNAMIC;
            this.colType = FudgeCore.COLLIDER_TYPE.CUBE;
            this.colGroup = FudgeCore.PHYSICS_GROUP.DEFAULT;
            this.linDamping = 0.1;
            this.angDamping = 0.1;
            this.rotationalInfluenceFactor = FudgeCore.Vector3.ONE();
            this.gravityInfluenceFactor = 1;
            //Setting up all incoming values to be internal values
            this.convexMesh = _convexMesh;
            this.rbType = _type;
            this.collisionGroup = _group;
            this.colliderType = _colliderType;
            this.mass = _mass;
            this.bodyRestitution = FudgeCore.Physics.settings.defaultRestitution;
            this.bodyFriction = FudgeCore.Physics.settings.defaultFriction;
            this.colMask = FudgeCore.Physics.settings.defaultCollisionMask;
            //Create the actual rigidbody in the OimoPhysics Space
            this.createRigidbody(_mass, _type, this.colliderType, _transform, this.collisionGroup);
            this.id = FudgeCore.Physics.world.distributeBodyID();
            //Handling adding/removing the component
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addRigidbodyToWorld);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.removeRigidbodyFromWorld);
        }
        /** The type of interaction between the physical world and the transform hierarchy world. DYNAMIC means the body ignores hierarchy and moves by physics. KINEMATIC it's
         * reacting to a [[Node]] that is using physics but can still be controlled by animation or transform. And STATIC means its immovable.
         */
        get physicsType() {
            return this.rbType;
        }
        set physicsType(_value) {
            this.rbType = _value;
            let oimoType;
            switch (this.rbType) {
                case FudgeCore.PHYSICS_TYPE.DYNAMIC:
                    oimoType = OIMO.RigidBodyType.DYNAMIC;
                    break;
                case FudgeCore.PHYSICS_TYPE.STATIC:
                    oimoType = OIMO.RigidBodyType.STATIC;
                    break;
                case FudgeCore.PHYSICS_TYPE.KINEMATIC:
                    oimoType = OIMO.RigidBodyType.KINEMATIC;
                    break;
                default:
                    oimoType = OIMO.RigidBodyType.DYNAMIC;
                    break;
            }
            this.rigidbody.setType(oimoType);
        }
        /** The shape that represents the [[Node]] in the physical world. Default is a Cube. */
        get colliderType() {
            return this.colType;
        }
        set colliderType(_value) {
            if (_value != this.colType && this.rigidbody != null)
                this.updateFromWorld();
            this.colType = _value;
        }
        /** The physics group this [[Node]] belongs to it's the default group normally which means it physically collides with every group besides trigger. */
        get collisionGroup() {
            return this.colGroup;
        }
        set collisionGroup(_value) {
            if (_value != FudgeCore.PHYSICS_GROUP.TRIGGER && this.colGroup == FudgeCore.PHYSICS_GROUP.TRIGGER) //Register/unregister triggers form the world
                FudgeCore.Physics.world.unregisterTrigger(this);
            if (_value == FudgeCore.PHYSICS_GROUP.TRIGGER)
                FudgeCore.Physics.world.registerTrigger(this);
            this.colGroup = _value;
            if (this.rigidbody != null)
                this.rigidbody.getShapeList().setCollisionGroup(this.colGroup);
        }
        /** The groups this object collides with. Groups must be writen in form of
         *  e.g. collisionMask = PHYSICS_GROUP.DEFAULT | PHYSICS_GROUP.GROUP_1 and so on to collide with multiple groups. */
        get collisionMask() {
            return this.colMask;
        }
        set collisionMask(_value) {
            this.colMask = _value;
        }
        /**
       * Returns the physical weight of the [[Node]]
       */
        get mass() {
            return this.rigidbody.getMass();
        }
        /**
      * Setting the physical weight of the [[Node]] in kg
      */
        set mass(_value) {
            this.massData.mass = _value;
            if (this.rigidbody != null)
                this.rigidbody.setMassData(this.massData);
        }
        /** Air reistance, when moving. A Body does slow down even on a surface without friction. */
        get linearDamping() {
            return this.rigidbody.getLinearDamping();
        }
        set linearDamping(_value) {
            this.linDamping = _value;
            this.rigidbody.setLinearDamping(_value);
        }
        /** Air resistance, when rotating. */
        get angularDamping() {
            return this.rigidbody.getAngularDamping();
        }
        set angularDamping(_value) {
            this.angDamping = _value;
            this.rigidbody.setAngularDamping(_value);
        }
        /** The factor this rigidbody reacts rotations that happen in the physical world. 0 to lock rotation this axis. */
        get rotationInfluenceFactor() {
            return this.rotationalInfluenceFactor;
        }
        set rotationInfluenceFactor(_influence) {
            this.rotationalInfluenceFactor = _influence;
            this.rigidbody.setRotationFactor(new OIMO.Vec3(this.rotationalInfluenceFactor.x, this.rotationalInfluenceFactor.y, this.rotationalInfluenceFactor.z));
        }
        /** The factor this rigidbody reacts to world gravity. Default = 1 e.g. 1*9.81 m/s. */
        get gravityScale() {
            return this.gravityInfluenceFactor;
        }
        set gravityScale(_influence) {
            this.gravityInfluenceFactor = _influence;
            if (this.rigidbody != null)
                this.rigidbody.setGravityScale(this.gravityInfluenceFactor);
        }
        /**
      * Get the friction of the rigidbody, which is the factor of sliding resistance of this rigidbody on surfaces
      */
        get friction() {
            return this.bodyFriction;
        }
        /**
       * Set the friction of the rigidbody, which is the factor of  sliding resistance of this rigidbody on surfaces
       */
        set friction(_friction) {
            this.bodyFriction = _friction;
            if (this.rigidbody.getShapeList() != null)
                this.rigidbody.getShapeList().setFriction(this.bodyFriction);
        }
        /**
      * Get the restitution of the rigidbody, which is the factor of bounciness of this rigidbody on surfaces
      */
        get restitution() {
            return this.bodyRestitution;
        }
        /**
       * Set the restitution of the rigidbody, which is the factor of bounciness of this rigidbody on surfaces
       */
        set restitution(_restitution) {
            this.bodyRestitution = _restitution;
            if (this.rigidbody.getShapeList() != null)
                this.rigidbody.getShapeList().setRestitution(this.bodyRestitution);
        }
        /**
        * Returns the rigidbody in the form the physics engine is using it, should not be used unless a functionality
        * is not provided through the FUDGE Integration.
        */
        getOimoRigidbody() {
            return this.rigidbody;
        }
        /**
       * Checking for Collision with other Colliders and dispatches a custom event with information about the collider.
       * Automatically called in the RenderManager, no interaction needed.
       */
        checkCollisionEvents() {
            let list = this.rigidbody.getContactLinkList(); //all physical contacts between colliding bodies on this rb
            let objHit; //collision consisting of 2 bodies, so Hit1/2
            let objHit2;
            let event; //The event that will be send and the informations added to it
            let normalImpulse = 0;
            let binormalImpulse = 0;
            let tangentImpulse = 0;
            let colPoint;
            //ADD NEW Collision - That just happened
            for (let i = 0; i < this.rigidbody.getNumContectLinks(); i++) {
                let collisionManifold = list.getContact().getManifold(); //Manifold = Additional informations about the contact
                objHit = list.getContact().getShape1().userData; //Userdata is used to transfer the ƒ.ComponentRigidbody, it's an empty OimoPhysics Variable
                //Only register the collision on the actual touch, not on "shadowCollide", to register in the moment of impulse calculation
                if (objHit == null || list.getContact().isTouching() == false) // only act if the collision is actual touching, so right at the moment when a impulse is happening, not when shapes overlap
                    return;
                objHit2 = list.getContact().getShape2().userData;
                if (objHit2 == null || list.getContact().isTouching() == false)
                    return;
                let points = collisionManifold.getPoints(); //All points in the collision where the two bodies are touching, used to calculate the full impact
                normalImpulse = 0;
                binormalImpulse = 0;
                tangentImpulse = 0;
                if (objHit.getOimoRigidbody() != this.getOimoRigidbody() && this.collisions.indexOf(objHit) == -1) { //Fire, if the hit object is not the Body itself but another and it's not already fired.
                    let colPos = points[0].getPosition2(); //THE point of collision is the first touching point (EXTENSION: could be the center of all touching points combined)
                    colPoint = new FudgeCore.Vector3(colPos.x, colPos.y, colPos.z);
                    points.forEach((value) => {
                        normalImpulse += value.getNormalImpulse();
                        binormalImpulse += value.getBinormalImpulse();
                        tangentImpulse += value.getTangentImpulse();
                    });
                    this.collisions.push(objHit); //Tell the object that the event for this object does not need to be fired again
                    event = new FudgeCore.EventPhysics("ColliderEnteredCollision" /* COLLISION_ENTER */, objHit, normalImpulse, tangentImpulse, binormalImpulse, colPoint); //Building the actual event, with what object did collide and informations about it
                    this.dispatchEvent(event); //Sending the given event
                }
                if (objHit2 != this && this.collisions.indexOf(objHit2) == -1) { //Same as the above but for the case the SECOND hit object is not the body itself
                    let colPos = points[0].getPosition2();
                    colPoint = new FudgeCore.Vector3(colPos.x, colPos.y, colPos.z);
                    points.forEach((value) => {
                        normalImpulse += value.getNormalImpulse();
                        binormalImpulse += value.getBinormalImpulse();
                        tangentImpulse += value.getTangentImpulse();
                    });
                    this.collisions.push(objHit2);
                    event = new FudgeCore.EventPhysics("ColliderEnteredCollision" /* COLLISION_ENTER */, objHit2, normalImpulse, tangentImpulse, binormalImpulse, colPoint);
                    this.dispatchEvent(event);
                }
                list = list.getNext(); //Start the same routine with the next collision in the list
            }
            //REMOVE OLD Collisions - That do not happen anymore
            this.collisions.forEach((value) => {
                let isColliding = false;
                list = this.rigidbody.getContactLinkList();
                for (let i = 0; i < this.rigidbody.getNumContectLinks(); i++) {
                    objHit = list.getContact().getShape1().userData;
                    objHit2 = list.getContact().getShape2().userData;
                    if (value == objHit || value == objHit2) { //If the given object in the collisions list is still one of the objHit the collision is not CollisionEXIT
                        isColliding = true;
                    }
                    list = list.getNext();
                }
                if (isColliding == false) { //The collision is exiting but was in the collision list, then EXIT Event needs to be fired
                    let index = this.collisions.indexOf(value); //Find object in the array
                    this.collisions.splice(index); //remove it from the array
                    event = new FudgeCore.EventPhysics("ColliderLeftCollision" /* COLLISION_EXIT */, value, 0, 0, 0);
                    this.dispatchEvent(event);
                }
            });
        }
        /**
          * Checking for Collision with Triggers with a overlapping test, dispatching a custom event with information about the trigger,
          * or triggered [[Node]]. Automatically called in the RenderManager, no interaction needed.
          */
        checkTriggerEvents() {
            let possibleTriggers = FudgeCore.Physics.world.getTriggerList(); //Get the array from the world that contains every trigger existing and check it with this body
            let event;
            //ADD - Similar to collision events but with overlapping instead of an actual collision
            possibleTriggers.forEach((value) => {
                let overlapping = this.collidesWith(this.getOimoRigidbody(), value.getOimoRigidbody()); //Check if the two colliders are overlapping
                if (overlapping && this.triggers.indexOf(value) == -1) {
                    this.triggers.push(value);
                    let enterPoint = this.getTriggerEnterPoint(this.getOimoRigidbody(), value.getOimoRigidbody());
                    event = new FudgeCore.EventPhysics("TriggerEnteredCollision" /* TRIGGER_ENTER */, value, 0, 0, 0, enterPoint);
                    this.dispatchEvent(event);
                }
            });
            //REMOVE
            this.triggers.forEach((value) => {
                let isTriggering = this.collidesWith(this.getOimoRigidbody(), value.getOimoRigidbody());
                if (isTriggering == false) {
                    let index = this.collisions.indexOf(value);
                    this.triggers.splice(index);
                    event = new FudgeCore.EventPhysics("TriggerLeftCollision" /* TRIGGER_EXIT */, value, 0, 0, 0);
                    this.dispatchEvent(event);
                }
            });
            if (this.colGroup == FudgeCore.PHYSICS_GROUP.TRIGGER) { //In case this is a trigger, it does not only need to send a trigger to everyone else but also receive a triggering for itself.
                this.checkBodiesInTrigger();
            }
        }
        /**
       * Checks that the Rigidbody is positioned correctly and recreates the Collider with new scale/position/rotation
       */
        updateFromWorld() {
            let worldTransform = super.getContainer().mtxWorld; //super.getContainer() != null ? super.getContainer().mtxWorld : Matrix4x4.IDENTITY(); //The the world information about where to position/scale/rotate
            let position = worldTransform.translation; //Adding the offsets from the pivot
            position.add(this.pivot.translation);
            let rotation = worldTransform.getEulerAngles();
            rotation.add(this.pivot.rotation);
            let scaling = worldTransform.scaling;
            scaling.x *= this.pivot.scaling.x;
            scaling.y *= this.pivot.scaling.y;
            scaling.z *= this.pivot.scaling.z;
            this.createCollider(new OIMO.Vec3(scaling.x / 2, scaling.y / 2, scaling.z / 2), this.colliderType); //recreate the collider
            this.collider = new OIMO.Shape(this.colliderInfo);
            let oldCollider = this.rigidbody.getShapeList();
            this.rigidbody.addShape(this.collider); //add new collider, before removing the old, so the rb is never active with 0 colliders
            this.rigidbody.removeShape(oldCollider); //remove the old collider
            this.collider.userData = this; //reset the extra information so that this collider knows to which Fudge Component it's connected
            this.collider.setCollisionGroup(this.collisionGroup);
            if (this.collisionGroup == FudgeCore.PHYSICS_GROUP.TRIGGER) //Trigger not collidering with anythign so their mask is only colliding with trigger
                this.collider.setCollisionMask(FudgeCore.PHYSICS_GROUP.TRIGGER);
            else
                this.collider.setCollisionMask(this.colMask);
            if (this.rigidbody.getShapeList() != null) { //reset the informations about physics handling, has to be done because the shape is new
                this.rigidbody.getShapeList().setRestitution(this.bodyRestitution);
                this.rigidbody.getShapeList().setFriction(this.bodyFriction);
            }
            this.rigidbody.setMassData(this.massData);
            this.setPosition(position); //set the actual new rotation/position for this Rb again since it's now updated
            this.setRotation(rotation);
        }
        /**
       * Get the current POSITION of the [[Node]] in the physical space
       */
        getPosition() {
            let tmpPos = this.rigidbody.getPosition();
            return new FudgeCore.Vector3(tmpPos.x, tmpPos.y, tmpPos.z);
        }
        /**
      * Sets the current POSITION of the [[Node]] in the physical space
      */
        setPosition(_value) {
            this.rigidbody.setPosition(new OIMO.Vec3(_value.x, _value.y, _value.z));
        }
        /**
         * Get the current ROTATION of the [[Node]] in the physical space
         */
        getRotation() {
            let orientation = this.rigidbody.getOrientation();
            let tmpQuat = new FudgeCore.Quaternion(orientation.x, orientation.y, orientation.z, orientation.w);
            return tmpQuat.toDegrees();
        }
        /**
         * Sets the current ROTATION of the [[Node]] in the physical space, in degree.
         */
        setRotation(_value) {
            this.rigidbody.setRotation(new OIMO.Mat3().fromEulerXyz(new OIMO.Vec3(_value.x * Math.PI / 180, _value.y * Math.PI / 180, _value.z * Math.PI / 180)));
        }
        //#region Velocity and Forces
        /**
        * Get the current VELOCITY of the [[Node]]
        */
        getVelocity() {
            let velocity = this.rigidbody.getLinearVelocity();
            return new FudgeCore.Vector3(velocity.x, velocity.y, velocity.z);
        }
        /**
         * Sets the current VELOCITY of the [[Node]]
         */
        setVelocity(_value) {
            let velocity = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.rigidbody.setLinearVelocity(velocity);
        }
        /**
         * Applies a continous FORCE at the center of the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS.
         * The force is measured in newton, 1kg needs about 10 Newton to fight against gravity.
         */
        applyForce(_force) {
            this.rigidbody.applyForceToCenter(new OIMO.Vec3(_force.x, _force.y, _force.z));
        }
        /**
        * Applies a continous FORCE at a specific point in the world to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
        */
        applyForceAtPoint(_force, _worldPoint) {
            this.rigidbody.applyForce(new OIMO.Vec3(_force.x, _force.y, _force.z), new OIMO.Vec3(_worldPoint.x, _worldPoint.y, _worldPoint.z));
        }
        /**
        * Applies a continous ROTATIONAL FORCE (Torque) to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
        */
        applyTorque(_rotationalForce) {
            this.rigidbody.applyTorque(new OIMO.Vec3(_rotationalForce.x, _rotationalForce.y, _rotationalForce.z));
        }
        /**
        * Applies a instant FORCE at a point/rigidbodycenter to the RIGIDBODY in the three dimensions. Considering the rigidbod's MASS
        * Influencing the angular speed and the linear speed.
        */
        applyImpulseAtPoint(_impulse, _worldPoint = null) {
            _worldPoint = _worldPoint != null ? _worldPoint : this.getPosition();
            this.rigidbody.applyImpulse(new OIMO.Vec3(_impulse.x, _impulse.y, _impulse.z), new OIMO.Vec3(_worldPoint.x, _worldPoint.y, _worldPoint.z));
        }
        /**
        * Applies a instant FORCE to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
        * Only influencing it's speed not rotation.
        */
        applyLinearImpulse(_impulse) {
            this.rigidbody.applyLinearImpulse(new OIMO.Vec3(_impulse.x, _impulse.y, _impulse.z));
        }
        /**
       * Applies a instant ROTATIONAL-FORCE to the RIGIDBODY in the three dimensions. Considering the rigidbody's MASS
       * Only influencing it's rotation.
       */
        applyAngularImpulse(_rotationalImpulse) {
            this.rigidbody.applyAngularImpulse(new OIMO.Vec3(_rotationalImpulse.x, _rotationalImpulse.y, _rotationalImpulse.z));
        }
        /**
       * Changing the VELOCITY of the RIGIDBODY. Only influencing the linear speed not angular
       */
        addVelocity(_value) {
            this.rigidbody.addLinearVelocity(new OIMO.Vec3(_value.x, _value.y, _value.z));
        }
        /**
       * Changing the VELOCITY of the RIGIDBODY. Only influencing the angular speed not the linear
       */
        addAngularVelocity(_value) {
            this.rigidbody.addAngularVelocity(new OIMO.Vec3(_value.x, _value.y, _value.z));
        }
        /** Stops the rigidbody from sleeping when movement is too minimal. Decreasing performance, for rarely more precise physics results */
        deactivateAutoSleep() {
            this.rigidbody.setAutoSleep(false);
        }
        activateAutoSleep() {
            this.rigidbody.setAutoSleep(true);
        }
        //#endregion
        //#events
        /**
         * Sends a ray through this specific body ignoring the rest of the world and checks if this body was hit by the ray,
         * returning info about the hit. Provides the same functionality and information a regular raycast does but the ray is only testing against this specific body.
         */
        raycastThisBody(_origin, _direction, _length) {
            let hitInfo = new FudgeCore.RayHitInfo();
            let geometry = this.rigidbody.getShapeList().getGeometry();
            let transform = this.rigidbody.getTransform();
            let scaledDirection = _direction;
            scaledDirection.scale(length);
            let endpoint = FudgeCore.Vector3.SUM(scaledDirection, _origin);
            let oimoRay;
            let hit = geometry.rayCast(new OIMO.Vec3(_origin.x, _origin.y, _origin.z), new OIMO.Vec3(endpoint.x, endpoint.y, endpoint.z), transform, oimoRay); //the actual OimoPhysics Raycast
            if (hit) { //If hit return a bunch of informations about the hit
                hitInfo.hit = true;
                hitInfo.hitPoint = new FudgeCore.Vector3(oimoRay.position.x, oimoRay.position.y, oimoRay.position.z);
                hitInfo.hitNormal = new FudgeCore.Vector3(oimoRay.normal.x, oimoRay.normal.y, oimoRay.normal.z);
                let dx = _origin.x - hitInfo.hitPoint.x; //calculate hit distance
                let dy = _origin.y - hitInfo.hitPoint.y;
                let dz = _origin.z - hitInfo.hitPoint.z;
                hitInfo.hitDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                hitInfo.rigidbodyComponent = this;
                hitInfo.rayOrigin = _origin;
                hitInfo.rayEnd = endpoint;
            }
            else { //Only tell the origin, and the hit point is the end of the ray.
                hitInfo.rayOrigin = _origin;
                hitInfo.hitPoint = new FudgeCore.Vector3(endpoint.x, endpoint.y, endpoint.z);
            }
            if (FudgeCore.Physics.settings.debugDraw) {
                FudgeCore.Physics.world.debugDraw.debugRay(hitInfo.rayOrigin, hitInfo.hitPoint, new FudgeCore.Color(0, 1, 0, 1));
            }
            return hitInfo;
        }
        //#region Saving/Loading - Some properties might be missing, e.g. convexMesh (Float32Array)
        serialize() {
            let serialization = {
                pivot: this.pivot.serialize(),
                id: this.id,
                physicsType: this.rbType,
                mass: this.massData.mass,
                colliderType: this.colType,
                linearDamping: this.linDamping,
                angularDamping: this.angDamping,
                collisionGroup: this.colGroup,
                rotationInfluence: this.rotationalInfluenceFactor,
                gravityScale: this.gravityInfluenceFactor,
                friction: this.bodyFriction,
                restitution: this.bodyRestitution,
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.pivot.deserialize(_serialization.pivot);
            this.id = _serialization.id;
            this.physicsType = _serialization.physicsType;
            this.mass = _serialization.mass != null ? _serialization.mass : 1;
            this.colliderType = _serialization.colliderType != null ? _serialization.colliderType : FudgeCore.COLLIDER_TYPE.CUBE;
            this.linearDamping = _serialization.linearDamping != null ? _serialization.linearDamping : this.linDamping;
            this.angularDamping = _serialization.angularDamping != null ? _serialization.angularDamping : this.angDamping;
            this.collisionGroup = _serialization.collisionGroup != null ? _serialization.collisionGroup : this.colGroup;
            this.rotationInfluenceFactor = _serialization.rotationInfluence != null ? _serialization.rotationInfluence : this.rotationalInfluenceFactor;
            this.gravityScale = _serialization.gravityScale != null ? _serialization.gravityScale : 1;
            this.friction = _serialization.friction != null ? _serialization.friction : this.bodyFriction;
            this.restitution = _serialization.restitution != null ? _serialization.restitution : this.bodyRestitution;
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        //#endregion
        /** Creates the actual OimoPhysics Rigidbody out of informations the Fudge Component has. */
        createRigidbody(_mass, _type, _colliderType, _transform, _collisionGroup = FudgeCore.PHYSICS_GROUP.DEFAULT) {
            let oimoType; //Need the conversion from simple enum to number because if enum is defined as Oimo.RigidyBodyType you have to include Oimo to use FUDGE at all
            switch (_type) {
                case FudgeCore.PHYSICS_TYPE.DYNAMIC:
                    oimoType = OIMO.RigidBodyType.DYNAMIC;
                    break;
                case FudgeCore.PHYSICS_TYPE.STATIC:
                    oimoType = OIMO.RigidBodyType.STATIC;
                    break;
                case FudgeCore.PHYSICS_TYPE.KINEMATIC:
                    oimoType = OIMO.RigidBodyType.KINEMATIC;
                    break;
                default:
                    oimoType = OIMO.RigidBodyType.DYNAMIC;
                    break;
            }
            let tmpTransform = _transform == null ? super.getContainer() != null ? super.getContainer().mtxWorld : FudgeCore.Matrix4x4.IDENTITY() : _transform; //Get transform informations from the world, since physics does not care about hierarchy
            //Convert informations from Fudge to OimoPhysics and creating a collider with it, while also adding a pivot to derivate from the transform informations if needed
            let scale = new OIMO.Vec3((tmpTransform.scaling.x * this.pivot.scaling.x) / 2, (tmpTransform.scaling.y * this.pivot.scaling.y) / 2, (tmpTransform.scaling.z * this.pivot.scaling.z) / 2);
            let position = new OIMO.Vec3(tmpTransform.translation.x + this.pivot.translation.x, tmpTransform.translation.y + this.pivot.translation.y, tmpTransform.translation.z + this.pivot.translation.z);
            let rotation = new OIMO.Vec3(tmpTransform.rotation.x + this.pivot.rotation.x, tmpTransform.rotation.y + this.pivot.rotation.y, tmpTransform.rotation.z + this.pivot.rotation.z);
            this.createCollider(scale, _colliderType);
            //Setting informations about mass, position/rotation and physical reaction type
            this.massData.mass = _mass; //_type != PHYSICS_TYPE.STATIC ? _mass : 0; //If a object is static it acts as if it has no mass
            this.rigidbodyInfo.type = oimoType;
            this.rigidbodyInfo.position = position;
            this.rigidbodyInfo.rotation.fromEulerXyz(new OIMO.Vec3(rotation.x, rotation.y, rotation.z)); //Convert eulerAngles in degree to the internally used quaternions
            //Creating the actual rigidbody and it's collider
            this.rigidbody = new OIMO.RigidBody(this.rigidbodyInfo);
            this.collider = new OIMO.Shape(this.colliderInfo);
            //Filling the additional settings and informations the rigidbody needs. Who is colliding, how is the collision handled (damping, influence factors)
            this.collider.userData = this;
            this.collider.setCollisionGroup(_collisionGroup);
            if (_collisionGroup == FudgeCore.PHYSICS_GROUP.TRIGGER)
                this.collider.setCollisionMask(FudgeCore.PHYSICS_GROUP.TRIGGER);
            else
                this.collider.setCollisionMask(this.colMask);
            this.rigidbody.addShape(this.collider);
            this.rigidbody.setMassData(this.massData);
            this.rigidbody.getShapeList().setRestitution(this.bodyRestitution);
            this.rigidbody.getShapeList().setFriction(this.bodyFriction);
            this.rigidbody.setLinearDamping(this.linDamping);
            this.rigidbody.setAngularDamping(this.angDamping);
            this.rigidbody.setGravityScale(this.gravityInfluenceFactor);
            this.rigidbody.setRotationFactor(new OIMO.Vec3(this.rotationalInfluenceFactor.x, this.rotationalInfluenceFactor.y, this.rotationalInfluenceFactor.z));
        }
        /** Creates a collider a shape that represents the object in the physical world.  */
        createCollider(_scale, _colliderType) {
            let shapeConf = new OIMO.ShapeConfig(); //Collider with geometry and infos like friction/restitution and more
            let geometry;
            if (this.colliderType != _colliderType) //If the collider type was changed set the internal one new, else don't so there is not infinite set calls
                this.colliderType = _colliderType;
            switch (_colliderType) { //Create a different OimoPhysics geometry based on the given type. That is only the mathematical shape of the collider
                case FudgeCore.COLLIDER_TYPE.CUBE:
                    geometry = new OIMO.BoxGeometry(_scale);
                    break;
                case FudgeCore.COLLIDER_TYPE.SPHERE:
                    geometry = new OIMO.SphereGeometry(_scale.x);
                    break;
                case FudgeCore.COLLIDER_TYPE.CAPSULE:
                    geometry = new OIMO.CapsuleGeometry(_scale.x, _scale.y);
                    break;
                case FudgeCore.COLLIDER_TYPE.CYLINDER:
                    geometry = new OIMO.CylinderGeometry(_scale.x, _scale.y);
                    break;
                case FudgeCore.COLLIDER_TYPE.CONE:
                    geometry = new OIMO.ConeGeometry(_scale.x, _scale.y);
                    break;
                case FudgeCore.COLLIDER_TYPE.PYRAMID:
                    geometry = this.createConvexGeometryCollider(this.createPyramidVertices(), _scale);
                    break;
                case FudgeCore.COLLIDER_TYPE.CONVEX:
                    geometry = this.createConvexGeometryCollider(this.convexMesh, _scale);
                    break;
            }
            shapeConf.geometry = geometry;
            this.colliderInfo = shapeConf; //the configuration informations that are used to add an actual collider to the rigidbody in createRigidbody
        }
        /** Creating a shape that represents a in itself closed form, out of the given vertices. */
        createConvexGeometryCollider(_vertices, _scale) {
            let verticesAsVec3 = new Array(); //Convert Fudge Vector3 to OimoVec3
            for (let i = 0; i < _vertices.length; i += 3) { //3 Values for one point
                verticesAsVec3.push(new OIMO.Vec3(_vertices[i] * _scale.x, _vertices[i + 1] * _scale.y, _vertices[i + 2] * _scale.z));
            }
            return new OIMO.ConvexHullGeometry(verticesAsVec3); //Tell OimoPhysics to create a hull that involves all points but close it of. A convex shape can not have a hole in it.
        }
        /** Internal implementation of vertices that construct a pyramid. The vertices of the implemented pyramid mesh can be used too. But they are halfed and double sided, so it's more performant to use this. */
        createPyramidVertices() {
            let vertices = new Float32Array([
                /*0*/ -1, 0, 1, /*1*/ 1, 0, 1, /*2*/ 1, 0, -1, /*3*/ -1, 0, -1,
                /*4*/ 0, 2, 0
            ]);
            return vertices;
        }
        /** Adding this ComponentRigidbody to the Physiscs.world giving the oimoPhysics system the information needed */
        addRigidbodyToWorld() {
            FudgeCore.Physics.world.addRigidbody(this);
        }
        /** Removing this ComponentRigidbody from the Physiscs.world taking the informations from the oimoPhysics system */
        removeRigidbodyFromWorld() {
            FudgeCore.Physics.world.removeRigidbody(this);
        }
        //#region private EVENT functions
        /** Check if two OimoPhysics Shapes collide with each other. By overlapping their approximations */
        collidesWith(triggerRigidbody, secondRigidbody) {
            let shape1 = triggerRigidbody.getShapeList().getAabb();
            let shape2 = secondRigidbody.getShapeList().getAabb();
            let colliding = shape1.overlap(shape2);
            return colliding;
        }
        /** Find the approximated entry point of a trigger event. To give the event a approximated information where to put something in the world when a triggerEvent has happened */
        getTriggerEnterPoint(triggerRigidbody, secondRigidbody) {
            let shape1 = triggerRigidbody.getShapeList().getAabb();
            let shape2 = secondRigidbody.getShapeList().getAabb();
            //Center of a intersection should be the origion of the collision, because the triggering just happened so one or two touching points the center of it is the entry point
            let intersect = shape1.getIntersection(shape2).getCenter();
            return new FudgeCore.Vector3(intersect.x, intersect.y, intersect.z);
        }
        /**
         * Events in case a body is in a trigger, so not only the body registers a triggerEvent but also the trigger itself.
         */
        checkBodiesInTrigger() {
            let possibleBodies = FudgeCore.Physics.world.getBodyList(); //Since this is a trigger it checks itself against everybody in the world
            let event;
            //ADD
            possibleBodies.forEach((value) => {
                let overlapping = this.collidesWith(this.getOimoRigidbody(), value.getOimoRigidbody());
                if (overlapping && this.bodiesInTrigger.indexOf(value) == -1) {
                    this.bodiesInTrigger.push(value);
                    let enterPoint = this.getTriggerEnterPoint(this.getOimoRigidbody(), value.getOimoRigidbody());
                    event = new FudgeCore.EventPhysics("TriggerEnteredCollision" /* TRIGGER_ENTER */, value, 0, 0, 0, enterPoint);
                    this.dispatchEvent(event);
                }
            });
            //REMOVE
            this.bodiesInTrigger.forEach((value) => {
                let isTriggering = this.collidesWith(this.getOimoRigidbody(), value.getOimoRigidbody());
                if (isTriggering == false) {
                    let index = this.collisions.indexOf(value);
                    this.bodiesInTrigger.splice(index);
                    event = new FudgeCore.EventPhysics("TriggerEnteredCollision" /* TRIGGER_ENTER */, value, 0, 0, 0);
                    this.dispatchEvent(event);
                }
            });
        }
    }
    ComponentRigidbody.iSubclass = FudgeCore.Component.registerSubclass(ComponentRigidbody);
    FudgeCore.ComponentRigidbody = ComponentRigidbody;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /** Internal class for holding data about physics debug vertices.*/
    class PhysicsDebugVertexBuffer {
        /** Setup the rendering context for this buffer and create the actual buffer for this context. */
        constructor(_renderingContext) {
            this.numVertices = 0;
            this.gl = _renderingContext;
            this.buffer = this.gl.createBuffer();
        }
        /** Fill the bound buffer with data. Used at buffer initialization */
        setData(array) {
            if (this.attribs == null)
                throw "set attributes first";
            this.numVertices = array.length / (this.stride / 4);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.DYNAMIC_DRAW);
            //not necessary an in webgl2 anymore to rebind the same last buffer (which is achieved by giving a null buffer), after buffer is changed. Removed it on all other occasions
            // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null); 
        }
        /** Update the data in the buffer */
        updateData(array) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(array));
        }
        /** Update the buffer with the specific type of Float32Array */
        updateDataFloat32Array(array) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, array);
        }
        /** Set Shader Attributes informations by getting their position in the shader, setting the offset, stride and size. For later use in the binding process */
        setAttribs(attribs) {
            this.attribs = attribs;
            this.offsets = [];
            this.stride = 0;
            var num = attribs.length;
            for (let i = 0; i < num; i++) {
                this.offsets.push(this.stride);
                this.stride += attribs[i].float32Count * Float32Array.BYTES_PER_ELEMENT; // 32bit float Bytes aer a constant of 4
            }
        }
        /** Get the position of the attribute in the shader */
        loadAttribIndices(_program) {
            this.indices = _program.getAttribIndices(this.attribs);
        }
        /** Enable a attribute in a shader for this context, */
        bindAttribs() {
            if (this.indices == null)
                throw "indices are not loaded";
            var num = this.attribs.length;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer); //making the buffer of this class the current buffer
            for (let i = 0; i < num; i++) {
                this.gl.enableVertexAttribArray(this.indices[i]); //enable the Attribute
                this.gl.vertexAttribPointer(this.indices[i], this.attribs[i].float32Count, this.gl.FLOAT, false, this.stride, this.offsets[i]); //creates a pointer and structure for this attribute
            }
        }
    }
    FudgeCore.PhysicsDebugVertexBuffer = PhysicsDebugVertexBuffer;
    /** Internal class for holding data about PhysicsDebugVertexBuffers */
    class PhysicsDebugIndexBuffer {
        /** Setup the rendering context for this buffer and create the actual buffer for this context. */
        constructor(_renderingContext) {
            this.gl = _renderingContext;
            this.buffer = this.gl.createBuffer();
        }
        /** Fill the bound buffer with data amount. Used at buffer initialization */
        setData(array) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(array), this.gl.DYNAMIC_DRAW);
            this.count = array.length;
        }
        /** Update the actual data in the buffer */
        updateData(array) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, new Int16Array(array));
        }
        /** Update the buffer with the specific type of Int16Array */
        updateDataInt16Array(array) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, array);
        }
        /** The actual DrawCall for physicsDebugDraw Buffers. This is where the information from the debug is actually drawn. */
        draw(_mode = this.gl.TRIANGLES, _count = -1) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            this.gl.drawElements(_mode, _count >= 0 ? _count : this.count, this.gl.UNSIGNED_SHORT, 0);
        }
    }
    FudgeCore.PhysicsDebugIndexBuffer = PhysicsDebugIndexBuffer;
    /** Internal class for managing data about webGL Attributes */
    class PhysicsDebugVertexAttribute {
        constructor(_float32Count, _name) {
            this.name = _name;
            this.float32Count = _float32Count;
        }
    }
    FudgeCore.PhysicsDebugVertexAttribute = PhysicsDebugVertexAttribute;
    /** Internal class for Shaders used only by the physics debugDraw */
    class PhysicsDebugShader {
        /** Introduce the Fudge Rendering Context to this class, creating a program and vertex/fragment shader in this context */
        constructor(_renderingContext) {
            this.gl = _renderingContext;
            this.program = this.gl.createProgram();
            this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
            this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        }
        /** Take glsl shaders as strings and compile them, attaching the compiled shaders to a program thats used by this rendering context. */
        compile(vertexSource, fragmentSource) {
            this.uniformLocationMap = new Map();
            this.compileShader(this.vertexShader, vertexSource);
            this.compileShader(this.fragmentShader, fragmentSource);
            this.gl.attachShader(this.program, this.vertexShader);
            this.gl.attachShader(this.program, this.fragmentShader);
            this.gl.linkProgram(this.program);
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) { //make sure the linking worked, so the program is valid, and shaders are working
                FudgeCore.Debug.log(this.gl.getProgramInfoLog(this.program));
            }
            this.gl.validateProgram(this.program);
            if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
                console.error('ERROR validating program!', this.gl.getProgramInfoLog(this.program));
                return;
            }
        }
        /** Get index of a attribute in a shader in this program */
        getAttribIndex(_name) {
            return this.gl.getAttribLocation(this.program, _name);
        }
        /** Get the location of a uniform in a shader in this program */
        getUniformLocation(_name) {
            if (this.uniformLocationMap.has(_name))
                return this.uniformLocationMap.get(_name);
            var location = this.gl.getUniformLocation(this.program, _name);
            this.uniformLocationMap.set(_name, location);
            return location;
        }
        /** Get all indices for every attribute in the shaders of this program */
        getAttribIndices(_attribs) {
            var indices = [];
            _attribs.forEach(value => {
                indices.push(this.getAttribIndex(value.name));
            });
            return indices;
        }
        /** Tell the Fudge Rendering Context to use this program to draw. */
        use() {
            this.gl.useProgram(this.program);
        }
        /** Compile a shader out of a string and validate it. */
        compileShader(shader, source) {
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                FudgeCore.Debug.log(this.gl.getShaderInfoLog(shader));
            }
        }
    }
    FudgeCore.PhysicsDebugShader = PhysicsDebugShader;
    /** Internal Class used to draw debugInformations about the physics simulation onto the renderContext. No user interaction needed. @author Marko Fehrenbach, HFU 2020 //Based on OimoPhysics Haxe DebugDrawDemo */
    class PhysicsDebugDraw extends FudgeCore.RenderOperator {
        /** Creating the debug for physics in Fudge. Tell it to draw only wireframe objects, since Fudge is handling rendering of the objects besides physics.
         * Override OimoPhysics Functions with own rendering. Initialize buffers and connect them with the context for later use. */
        constructor() {
            super();
            this.style = new OIMO.DebugDrawStyle();
            this.oimoDebugDraw = new OIMO.DebugDraw();
            this.oimoDebugDraw.wireframe = true;
            this.gl = FudgeCore.RenderOperator.crc3;
            this.initializeOverride();
            this.shader = new PhysicsDebugShader(this.gl);
            this.shader.compile(this.vertexShaderSource(), this.fragmentShaderSource());
            this.initializeBuffers();
        }
        /** Receive the current DebugMode from the physics settings and set the OimoPhysics.DebugDraw booleans to show only certain informations.
         * Needed since some debug informations exclude others, and can't be drawn at the same time, by OimoPhysics. And for users it provides more readability
         * to debug only what they need and is commonly debugged.
         */
        getDebugModeFromSettings() {
            let mode = FudgeCore.Physics.settings.debugMode;
            let elementsToDraw = new Array();
            switch (mode) {
                case 0: //Colliders and Bases
                    elementsToDraw = [false, true, false, false, false, false, false, false, true];
                    break;
                case 1: //Colliders and joints
                    elementsToDraw = [false, false, false, false, false, true, true, false, true];
                    break;
                case 2: //Bounding Box / Broadphase Bvh / Bases
                    elementsToDraw = [true, true, true, false, false, false, false, false, false];
                    break;
                case 3: //Contacts
                    elementsToDraw = [false, true, false, true, true, false, false, true, true];
                    break;
                case 4: //Physics Objects only, shows same as Collider / Joints but also hiding every other fudge object
                    elementsToDraw = [false, true, false, false, false, true, true, false, true];
                    break;
            }
            this.oimoDebugDraw.drawAabbs = elementsToDraw[0];
            this.oimoDebugDraw.drawBases = elementsToDraw[1];
            this.oimoDebugDraw.drawBvh = elementsToDraw[2];
            this.oimoDebugDraw.drawContactBases = elementsToDraw[3];
            this.oimoDebugDraw.drawContacts = elementsToDraw[4];
            this.oimoDebugDraw.drawJointLimits = elementsToDraw[5];
            this.oimoDebugDraw.drawJoints = elementsToDraw[6];
            this.oimoDebugDraw.drawPairs = elementsToDraw[7];
            this.oimoDebugDraw.drawShapes = elementsToDraw[8];
        }
        /** Creating the render buffers for later use. Defining the attributes used in shaders.
         * Needs to create empty buffers to already have them ready to draw later on, linking is only possible with existing buffers. No performance loss because empty buffers are not drawn.*/
        initializeBuffers() {
            var attribs = [
                new PhysicsDebugVertexAttribute(3, "aPosition"),
                new PhysicsDebugVertexAttribute(3, "aNormal"),
                new PhysicsDebugVertexAttribute(3, "aColor")
            ];
            this.pointVBO = new PhysicsDebugVertexBuffer(this.gl);
            this.pointIBO = new PhysicsDebugIndexBuffer(this.gl);
            this.pointVBO.setAttribs(attribs);
            this.pointVBO.loadAttribIndices(this.shader);
            this.lineVBO = new PhysicsDebugVertexBuffer(this.gl);
            this.lineIBO = new PhysicsDebugIndexBuffer(this.gl);
            this.lineVBO.setAttribs(attribs);
            this.lineVBO.loadAttribIndices(this.shader);
            this.triVBO = new PhysicsDebugVertexBuffer(this.gl);
            this.triIBO = new PhysicsDebugIndexBuffer(this.gl);
            this.triVBO.setAttribs(attribs);
            this.triVBO.loadAttribIndices(this.shader);
            this.pointBufferSize = 4096;
            this.lineBufferSize = 4096;
            this.triBufferSize = 4096;
            this.pointData = new Float32Array(this.pointBufferSize * 9);
            this.lineData = new Float32Array(this.lineBufferSize * 9 * 2);
            this.triData = new Float32Array(this.triBufferSize * 9 * 3);
            this.initFloatArray(this.pointData);
            this.initFloatArray(this.lineData);
            this.initFloatArray(this.triData);
            var vbo = [];
            var ibo = [];
            for (let i = 0; i < this.pointBufferSize; i++) {
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // pos1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // nml1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // rgb1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // pos2
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // nml2
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // rgb2
                ibo.push(i);
            }
            this.pointVBO.setData(vbo);
            this.pointIBO.setData(ibo);
            vbo = [];
            ibo = [];
            for (let i = 0; i < this.lineBufferSize; i++) {
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // pos1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // nml1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // rgb1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // pos2
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // nml2
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // rgb2
                ibo.push(i * 2);
                ibo.push(i * 2 + 1);
            }
            this.lineVBO.setData(vbo);
            this.lineIBO.setData(ibo);
            vbo = [];
            ibo = [];
            for (let i = 0; i < this.triBufferSize; i++) {
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // pos1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // nml1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // rgb1
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // pos2
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // nml2
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // rgb2
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // pos3
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // nml3
                vbo.push(0);
                vbo.push(0);
                vbo.push(0); // rgb3
                ibo.push(i * 3);
                ibo.push(i * 3 + 1);
                ibo.push(i * 3 + 2);
            }
            this.triVBO.setData(vbo);
            this.triIBO.setData(ibo);
        }
        /** Fill an array with empty values */
        initFloatArray(a) {
            var num = a.length;
            for (let i = 0; i < num; i++) {
                a[i] = 0;
            }
        }
        /** Overriding the existing functions from OimoPhysics.DebugDraw without actually inherit from the class, to avoid compiler problems.
         * Overriding them to receive debugInformations in the format the physic engine provides them but handling the rendering in the fudge context. */
        initializeOverride() {
            //Override point/line/triangle functions of OimoPhysics which are used to draw wireframes of objects, lines of raycasts or triangles when the objects are rendered by the physics not FUDGE (unused)
            OIMO.DebugDraw.prototype.point = function (v, color) {
                let debugWrapper = FudgeCore.Physics.world.debugDraw; //Get the custom physics debug class to have access to the data.
                if (FudgeCore.Physics.world.mainCam != null) { //only act when there is a camera that is rendering
                    let idx = debugWrapper.numPointData * 9; //offset from last call
                    let data = debugWrapper.pointData; //get the already written buffer informations
                    data[idx++] = v.x; //fill in the informations - position, normals, color
                    data[idx++] = v.y;
                    data[idx++] = v.z;
                    data[idx++] = 0;
                    data[idx++] = 0;
                    data[idx++] = 0;
                    data[idx++] = color.x;
                    data[idx++] = color.y;
                    data[idx++] = color.z;
                    debugWrapper.numPointData++;
                    //when the buffer is fully filled draw and reset - Not needed it's handled through the begin/end functions - removed in line/triangles
                    // if (debugWrapper.numPointData == debugWrapper.pointBufferSize) {  
                    //   debugWrapper.pointVBO.updateDataFloat32Array(debugWrapper.pointData);
                    //   debugWrapper.pointVBO.bindAttribs();
                    //   debugWrapper.pointIBO.draw(RenderOperator.crc3.POINTS);
                    //   debugWrapper.numPointData = 0;
                    // }
                }
            };
            OIMO.DebugDraw.prototype.line = function (v1, v2, color) {
                let debugWrapper = FudgeCore.Physics.world.debugDraw;
                if (FudgeCore.Physics.world.mainCam != null) {
                    let idx = debugWrapper.numLineData * 18;
                    let data = debugWrapper.lineData;
                    data[idx++] = v1.x;
                    data[idx++] = v1.y;
                    data[idx++] = v1.z;
                    data[idx++] = 0;
                    data[idx++] = 0;
                    data[idx++] = 0;
                    data[idx++] = color.x;
                    data[idx++] = color.y;
                    data[idx++] = color.z;
                    data[idx++] = v2.x;
                    data[idx++] = v2.y;
                    data[idx++] = v2.z;
                    data[idx++] = 0;
                    data[idx++] = 0;
                    data[idx++] = 0;
                    data[idx++] = color.x;
                    data[idx++] = color.y;
                    data[idx++] = color.z;
                    debugWrapper.numLineData++;
                }
            };
            OIMO.DebugDraw.prototype.triangle = function (v1, v2, v3, n1, n2, n3, color) {
                let debugWrapper = FudgeCore.Physics.world.debugDraw;
                if (FudgeCore.Physics.world.mainCam != null) {
                    var idx = debugWrapper.numTriData * 27;
                    var data = debugWrapper.triData;
                    data[idx++] = v1.x;
                    data[idx++] = v1.y;
                    data[idx++] = v1.z;
                    data[idx++] = n1.x;
                    data[idx++] = n1.y;
                    data[idx++] = n1.z;
                    data[idx++] = color.x;
                    data[idx++] = color.y;
                    data[idx++] = color.z;
                    data[idx++] = v2.x;
                    data[idx++] = v2.y;
                    data[idx++] = v2.z;
                    data[idx++] = n2.x;
                    data[idx++] = n2.y;
                    data[idx++] = n2.z;
                    data[idx++] = color.x;
                    data[idx++] = color.y;
                    data[idx++] = color.z;
                    data[idx++] = v3.x;
                    data[idx++] = v3.y;
                    data[idx++] = v3.z;
                    data[idx++] = n3.x;
                    data[idx++] = n3.y;
                    data[idx++] = n3.z;
                    data[idx++] = color.x;
                    data[idx++] = color.y;
                    data[idx++] = color.z;
                    debugWrapper.numTriData++;
                }
            };
        }
        /** Before OimoPhysics.world is filling the debug. Make sure the buffers are reset. Also receiving the debugMode from settings and updating the current projection for the vertexShader. */
        begin() {
            this.getDebugModeFromSettings();
            this.gl.lineWidth(2.0); //Does not affect anything because lineWidth is currently only supported by Microsoft Edge and Fudge is optimized for Chrome
            let projection = FudgeCore.Physics.world.mainCam.ViewProjectionMatrix.get();
            this.gl.uniformMatrix4fv(this.shader.getUniformLocation("u_projection"), false, projection);
            this.numPointData = 0;
            this.numLineData = 0;
            this.numTriData = 0;
        }
        /** After OimoPhysics.world filled the debug. Rendering calls. Setting this program to be used by the Fudge rendering context. And draw each updated buffer and resetting them. */
        end() {
            this.shader.use();
            if (this.numPointData > 0) {
                this.pointVBO.updateDataFloat32Array(this.pointData);
                this.pointVBO.bindAttribs();
                this.pointIBO.draw(this.gl.POINTS, this.numPointData);
                this.numPointData = 0;
            }
            if (this.numLineData > 0) {
                this.lineVBO.updateDataFloat32Array(this.lineData);
                this.lineVBO.bindAttribs();
                this.lineIBO.draw(this.gl.LINES, this.numLineData * 2);
                this.numLineData = 0;
            }
            if (this.numTriData > 0) {
                this.triVBO.updateDataFloat32Array(this.triData);
                this.triVBO.bindAttribs();
                this.triIBO.draw(this.gl.TRIANGLES, this.numTriData * 3);
                this.numTriData = 0;
            }
        }
        /** Drawing the ray into the debugDraw Call. By using the overwritten line rendering functions and drawing a point (pointSize defined in the shader) at the end of the ray. */
        debugRay(_origin, _end, _color) {
            this.oimoDebugDraw.line(new OIMO.Vec3(_origin.x, _origin.y, _origin.z), new OIMO.Vec3(_end.x, _end.y, _end.z), new OIMO.Vec3(_color.r, _color.g, _color.b));
            this.oimoDebugDraw.point(new OIMO.Vec3(_end.x, _end.y, _end.z), new OIMO.Vec3(_color.r, _color.g, _color.b));
        }
        /** The source code (string) of the in physicsDebug used very simple vertexShader.
         *  Handling the projection (which includes, view/world[is always identity in this case]/projection in Fudge). Increasing the size of single points drawn.
         *  And transfer position color to the fragmentShader. */
        vertexShaderSource() {
            return `
			precision mediump float;
			attribute vec3 aPosition;
			attribute vec3 aColor;
			attribute vec3 aNormal;
			varying vec3 vPosition;
			varying vec3 vNormal;
			varying vec3 vColor;
			uniform mat4 u_projection;

			void main() {
				vPosition = aPosition;
				vColor = aColor;
				vNormal = aNormal;
				gl_Position = u_projection * vec4(aPosition,1.0);
				gl_PointSize = 6.0;
			}`;
        }
        /** The source code (string) of the in physicsDebug used super simple fragmentShader. Unlit - only colorizing the drawn pixels, normals/position are given to make it expandable */
        fragmentShaderSource() {
            return `
      precision mediump float;
			varying vec3 vPosition;
			varying vec3 vNormal;
			varying vec3 vColor;

			void main() {
				gl_FragColor = vec4(vColor, 1.0);
			}`;
        }
    }
    FudgeCore.PhysicsDebugDraw = PhysicsDebugDraw;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventPhysics extends Event {
        /** Creates a new event customized for physics. Holding informations about impulses. Collision point and the body that is colliding */
        constructor(_type, _hitRigidbody, _normalImpulse, _tangentImpulse, _binormalImpulse, _collisionPoint = null) {
            super(_type);
            this.cmpRigidbody = _hitRigidbody;
            this.normalImpulse = _normalImpulse;
            this.tangentImpulse = _tangentImpulse;
            this.binomalImpulse = _binormalImpulse;
            this.collisionPoint = _collisionPoint;
        }
    }
    FudgeCore.EventPhysics = EventPhysics;
    /**
  * Groups to place a node in, not every group should collide with every group. Use a Mask in to exclude collisions
  */
    let PHYSICS_GROUP;
    (function (PHYSICS_GROUP) {
        PHYSICS_GROUP[PHYSICS_GROUP["DEFAULT"] = 1] = "DEFAULT";
        PHYSICS_GROUP[PHYSICS_GROUP["TRIGGER"] = 60000] = "TRIGGER";
        PHYSICS_GROUP[PHYSICS_GROUP["GROUP_1"] = 2] = "GROUP_1";
        PHYSICS_GROUP[PHYSICS_GROUP["GROUP_2"] = 4] = "GROUP_2";
        PHYSICS_GROUP[PHYSICS_GROUP["GROUP_3"] = 8] = "GROUP_3";
        PHYSICS_GROUP[PHYSICS_GROUP["GROUP_4"] = 16] = "GROUP_4";
    })(PHYSICS_GROUP = FudgeCore.PHYSICS_GROUP || (FudgeCore.PHYSICS_GROUP = {}));
    /**
    * Different types of physical interaction, DYNAMIC is fully influenced by physics and only physics, STATIC means immovable,
    * KINEMATIC is moved through transform and animation instead of physics code.
    */
    let PHYSICS_TYPE;
    (function (PHYSICS_TYPE) {
        PHYSICS_TYPE[PHYSICS_TYPE["DYNAMIC"] = 0] = "DYNAMIC";
        PHYSICS_TYPE[PHYSICS_TYPE["STATIC"] = 1] = "STATIC";
        PHYSICS_TYPE[PHYSICS_TYPE["KINEMATIC"] = 2] = "KINEMATIC"; // = OIMO.RigidBodyType.KINEMATIC
    })(PHYSICS_TYPE = FudgeCore.PHYSICS_TYPE || (FudgeCore.PHYSICS_TYPE = {}));
    /**
    * Different types of collider shapes, with different options in scaling BOX = Vector3(length, height, depth),
    * SPHERE = Vector3(diameter, x, x), CAPSULE = Vector3(diameter, height, x), CYLINDER = Vector3(diameter, height, x),
    * CONE = Vector(diameter, height, x), PYRAMID = Vector3(length, height, depth); x == unused.
    * CONVEX = ComponentMesh needs to be available in the RB Property convexMesh, the points of that component are used to create a collider that matches,
    * the closest possible representation of that form, in form of a hull. Convex is experimental and can produce unexpected behaviour when vertices
    * are too close to one another and the given vertices do not form a in itself closed shape and having a genus of 0 (no holes). Vertices in the ComponentMesh can be scaled differently
    * for texturing/normal or other reasons, so the collider might be off compared to the visual shape, this can be corrected by changing the pivot scale of the ComponentRigidbody.
    */
    let COLLIDER_TYPE;
    (function (COLLIDER_TYPE) {
        COLLIDER_TYPE[COLLIDER_TYPE["CUBE"] = 0] = "CUBE";
        COLLIDER_TYPE[COLLIDER_TYPE["SPHERE"] = 1] = "SPHERE";
        COLLIDER_TYPE[COLLIDER_TYPE["CAPSULE"] = 2] = "CAPSULE";
        COLLIDER_TYPE[COLLIDER_TYPE["CYLINDER"] = 3] = "CYLINDER";
        COLLIDER_TYPE[COLLIDER_TYPE["CONE"] = 4] = "CONE";
        COLLIDER_TYPE[COLLIDER_TYPE["PYRAMID"] = 5] = "PYRAMID";
        COLLIDER_TYPE[COLLIDER_TYPE["CONVEX"] = 6] = "CONVEX";
    })(COLLIDER_TYPE = FudgeCore.COLLIDER_TYPE || (FudgeCore.COLLIDER_TYPE = {}));
    /** Displaying different types of debug information about different physic features. Default = JOINTS_AND_COLLIDER. debugDraw in the settings must be active to see anything. */
    let PHYSICS_DEBUGMODE;
    (function (PHYSICS_DEBUGMODE) {
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["COLLIDERS"] = 0] = "COLLIDERS";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["JOINTS_AND_COLLIDER"] = 1] = "JOINTS_AND_COLLIDER";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["BOUNDING_BOXES"] = 2] = "BOUNDING_BOXES";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["CONTACTS"] = 3] = "CONTACTS";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["PHYSIC_OBJECTS_ONLY"] = 4] = "PHYSIC_OBJECTS_ONLY";
    })(PHYSICS_DEBUGMODE = FudgeCore.PHYSICS_DEBUGMODE || (FudgeCore.PHYSICS_DEBUGMODE = {}));
    /** Info about Raycasts shot from the physics system. */
    class RayHitInfo {
        constructor() {
            this.rayOrigin = FudgeCore.Vector3.ZERO();
            this.rayEnd = FudgeCore.Vector3.ZERO();
            this.hit = false;
            this.hitDistance = 0;
            this.hitPoint = FudgeCore.Vector3.ZERO();
            this.hitNormal = FudgeCore.Vector3.ZERO();
        }
    }
    FudgeCore.RayHitInfo = RayHitInfo;
    /** General settings for the physic simulation and the debug of it. */
    class PhysicsSettings {
        constructor(_defGroup, _defMask) {
            /** Whether the debug informations of the physics should be displayed or not (default = false) */
            this.debugDraw = false;
            this.physicsDebugMode = PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
            this.defaultCollisionGroup = _defGroup;
            this.defaultCollisionMask = _defMask;
        }
        get debugMode() {
            return this.physicsDebugMode;
        }
        set debugMode(_value) {
            this.physicsDebugMode = _value;
        }
        /** Change if rigidbodies are able to sleep (don't be considered in physical calculations) when their movement is below a threshold. Deactivation is decreasing performance for minor advantage in precision. */
        get disableSleeping() {
            return OIMO.Setting.disableSleeping;
        }
        set disableSleeping(_value) {
            OIMO.Setting.disableSleeping = _value;
        }
        /** Sleeping Threshold for Movement Veloctiy. */
        get sleepingVelocityThreshold() {
            return OIMO.Setting.sleepingVelocityThreshold;
        }
        set sleepingVelocityThreshold(_value) {
            OIMO.Setting.sleepingVelocityThreshold = _value;
        }
        /** Sleeping Threshold for Rotation Velocity. */
        get sleepingAngularVelocityThreshold() {
            return OIMO.Setting.sleepingAngularVelocityThreshold;
        }
        set sleepingAngularVelocityThreshold(_value) {
            OIMO.Setting.sleepingAngularVelocityThreshold = _value;
        }
        /** Threshold how long the Rigidbody must be below/above the threshold to count as sleeping. */
        get sleepingTimeThreshold() {
            return OIMO.Setting.sleepingTimeThreshold;
        }
        set sleepingTimeThreshold(_value) {
            OIMO.Setting.sleepingTimeThreshold = _value;
        }
        /** Error threshold. Default is 0.05. The higher the more likely collisions get detected before actual impact at high speeds but it's visually less accurate. */
        get defaultCollisionMargin() {
            return OIMO.Setting.defaultGJKMargin;
        }
        set defaultCollisionMargin(_thickness) {
            OIMO.Setting.defaultGJKMargin = _thickness;
        }
        /** The default applied friction between two rigidbodies with the default value. How much velocity is slowed down when moving accross this surface. */
        get defaultFriction() {
            return OIMO.Setting.defaultFriction;
        }
        set defaultFriction(_value) {
            OIMO.Setting.defaultFriction = _value;
        }
        /** Bounciness of rigidbodies. How much of the impact is restituted. */
        get defaultRestitution() {
            return OIMO.Setting.defaultRestitution;
        }
        set defaultRestitution(_value) {
            OIMO.Setting.defaultRestitution = _value;
        }
        /** Groups the default rigidbody will collide with. Set it like: (PHYSICS_GROUP.DEFAULT | PHYSICS_GROUP.GROUP_1 | PHYSICS_GROUP.GROUP_2 | PHYSICS_GROUP.GROUP_3)
         * to collide with multiple groups. Default is collision with everything but triggers.
        */
        get defaultCollisionMask() {
            return OIMO.Setting.defaultCollisionMask;
        }
        set defaultCollisionMask(_value) {
            OIMO.Setting.defaultCollisionMask = _value;
        }
        /** The group that this rigidbody belongs to. Default is the DEFAULT Group which means its just a normal Rigidbody not a trigger nor anything special. */
        get defaultCollisionGroup() {
            return OIMO.Setting.defaultCollisionGroup;
        }
        set defaultCollisionGroup(_value) {
            OIMO.Setting.defaultCollisionGroup = _value;
        }
    }
    FudgeCore.PhysicsSettings = PhysicsSettings;
})(FudgeCore || (FudgeCore = {}));
///<reference path="../../../Physics/OIMOPhysics.d.ts"/>
var FudgeCore;
///<reference path="../../../Physics/OIMOPhysics.d.ts"/>
(function (FudgeCore) {
    /**
    * Main Physics Class to hold information about the physical representation of the scene
    * @author Marko Fehrenbach, HFU 2020
    */
    class Physics {
        constructor() {
            this.bodyList = new Array();
            this.triggerBodyList = new Array();
            this.jointList = new Array();
        }
        /**
       * Creating a physical world to represent the [[Node]] Scene Tree. Call once before using any physics functions or
       * rigidbodies.
       */
        static initializePhysics() {
            if (typeof OIMO !== "undefined" && this.world == null) { //Check if OIMO Namespace was loaded, else do not use any physics. Check is needed to ensure FUDGE can be used without Physics
                this.world = new Physics();
                this.settings = new FudgeCore.PhysicsSettings(FudgeCore.PHYSICS_GROUP.DEFAULT, (FudgeCore.PHYSICS_GROUP.DEFAULT | FudgeCore.PHYSICS_GROUP.GROUP_1 | FudgeCore.PHYSICS_GROUP.GROUP_2 | FudgeCore.PHYSICS_GROUP.GROUP_3 | FudgeCore.PHYSICS_GROUP.GROUP_4));
                this.world.createWorld(); //create the actual oimoPhysics World
                this.world.debugDraw = new FudgeCore.PhysicsDebugDraw(); //Create a Fudge Physics debugging handling object
                this.world.oimoWorld.setDebugDraw(this.world.debugDraw.oimoDebugDraw); //Tell OimoPhysics where to debug to and how it will be handled
            }
            return this.world;
        }
        /**
      * Cast a RAY into the physical world from a origin point in a certain direction. Receiving informations about the hit object and the
      * hit point. Do not specify a _group to raycast the whole world, else only bodies within the specific group can be hit.
      */
        static raycast(_origin, _direction, _length = 1, _group = FudgeCore.PHYSICS_GROUP.DEFAULT) {
            let hitInfo = new FudgeCore.RayHitInfo();
            let ray = new OIMO.RayCastClosest();
            let begin = new OIMO.Vec3(_origin.x, _origin.y, _origin.z);
            let end = this.getRayEndPoint(begin, new FudgeCore.Vector3(_direction.x, _direction.y, _direction.z), _length);
            ray.clear();
            if (_group == FudgeCore.PHYSICS_GROUP.DEFAULT) { //Case 1: Raycasting the whole world, normal mode
                Physics.world.oimoWorld.rayCast(begin, end, ray);
            }
            else { //Case2: Raycasting on each body in a specific group
                let allHits = new Array();
                this.world.bodyList.forEach(function (value) {
                    if (value.collisionGroup == _group) {
                        hitInfo = value.raycastThisBody(_origin, _direction, _length);
                        if (hitInfo.hit == true) { //Every hit is could potentially be the closest
                            allHits.push(hitInfo);
                        }
                    }
                });
                allHits.forEach(function (value) {
                    if (value.hitDistance < hitInfo.hitDistance || hitInfo.hit == false) {
                        hitInfo = value;
                    }
                });
            }
            if (ray.hit) { //Fill in informations on the hit
                hitInfo.hit = true;
                hitInfo.hitPoint = new FudgeCore.Vector3(ray.position.x, ray.position.y, ray.position.z);
                hitInfo.hitNormal = new FudgeCore.Vector3(ray.normal.x, ray.normal.y, ray.normal.z);
                hitInfo.hitDistance = this.getRayDistance(_origin, hitInfo.hitPoint);
                hitInfo.rigidbodyComponent = ray.shape.userData;
                hitInfo.rayEnd = new FudgeCore.Vector3(end.x, end.y, end.z);
                hitInfo.rayOrigin = _origin;
            }
            else {
                hitInfo.rayOrigin = _origin;
                hitInfo.hitPoint = new FudgeCore.Vector3(end.x, end.y, end.z);
            }
            if (Physics.settings.debugDraw) { //Handle debugging
                Physics.world.debugDraw.debugRay(hitInfo.rayOrigin, hitInfo.hitPoint, new FudgeCore.Color(0, 1, 0, 1));
            }
            return hitInfo;
        }
        /**
      * Starts the physical world by checking that each body has the correct values from the Scene Tree
      */
        static start(_sceneTree) {
            FudgeCore.RenderManager.setupTransformAndLights(_sceneTree);
            this.world.updateWorldFromWorldMatrix();
        }
        /** Internal function to calculate the endpoint of mathematical ray. By adding the multiplied direction to the origin.
         * Used because OimoPhysics defines ray by start/end. But GameEngines commonly use origin/direction.
         */
        static getRayEndPoint(start, direction, length) {
            let origin = new FudgeCore.Vector3(start.x, start.y, start.z);
            let scaledDirection = direction;
            scaledDirection.scale(length);
            let endpoint = FudgeCore.Vector3.SUM(scaledDirection, origin);
            return new OIMO.Vec3(endpoint.x, endpoint.y, endpoint.z);
        }
        /** Internal function to get the distance in which a ray hit by subtracting points from each other and get the square root of the squared product of each component. */
        static getRayDistance(origin, hitPoint) {
            let dx = origin.x - hitPoint.x;
            let dy = origin.y - hitPoint.y;
            let dz = origin.z - hitPoint.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        /** Returns all the ComponentRigidbodies that are known to the physical space. */
        getBodyList() {
            return this.bodyList;
        }
        /** Returns all the ComponentRigidbodies that are in the specific group of triggers. */
        getTriggerList() {
            return this.triggerBodyList;
        }
        /**
      * Getting the solver iterations of the physics engine. Higher iteration numbers increase accuracy but decrease performance
      */
        getSolverIterations() {
            return Physics.world.oimoWorld.getNumPositionIterations();
        }
        /**
      * Setting the solver iterations of the physics engine. Higher iteration numbers increase accuracy but decrease performance
      */
        setSolverIterations(_value) {
            Physics.world.oimoWorld.setNumPositionIterations(_value);
            Physics.world.oimoWorld.setNumVelocityIterations(_value);
        }
        /**
      * Get the applied gravitational force to physical objects. Default earth gravity = 9.81 m/s
      */
        getGravity() {
            let tmpVec = Physics.world.oimoWorld.getGravity();
            return new FudgeCore.Vector3(tmpVec.x, tmpVec.y, tmpVec.z);
        }
        /**
      * Set the applied gravitational force to physical objects. Default earth gravity = 9.81 m/s
      */
        setGravity(_value) {
            let tmpVec = new OIMO.Vec3(_value.x, _value.y, _value.z);
            Physics.world.oimoWorld.setGravity(tmpVec);
        }
        /**
      * Adding a new OIMO Rigidbody to the OIMO World, happens automatically when adding a FUDGE Rigidbody Component
      */
        addRigidbody(_cmpRB) {
            this.bodyList.push(_cmpRB);
            Physics.world.oimoWorld.addRigidBody(_cmpRB.getOimoRigidbody());
        }
        /**
      * Removing a OIMO Rigidbody to the OIMO World, happens automatically when removing a FUDGE Rigidbody Component
      */
        removeRigidbody(_cmpRB) {
            let id = this.bodyList.indexOf(_cmpRB);
            this.bodyList.splice(id, 1);
            Physics.world.oimoWorld.removeRigidBody(_cmpRB.getOimoRigidbody());
        }
        /**
    * Adding a new OIMO Joint/Constraint to the OIMO World, happens automatically when adding a FUDGE Joint Component
    */
        addJoint(_cmpJoint) {
            Physics.world.oimoWorld.addJoint(_cmpJoint.getOimoJoint());
        }
        /**
        * Removing a OIMO Joint/Constraint to the OIMO World, happens automatically when removeing a FUDGE Joint Component
        */
        removeJoint(_cmpJoint) {
            Physics.world.oimoWorld.removeJoint(_cmpJoint.getOimoJoint());
        }
        /**
      * Simulates the physical world. _deltaTime is the amount of time between physical steps, default is 60 frames per second ~17ms
      */
        simulate(_deltaTime = 1 / 60) {
            if (this.jointList.length > 0)
                this.connectJoints(); //Connect joints if anything has happened between the last call to any of the two paired rigidbodies
            Physics.world.oimoWorld.step(_deltaTime * FudgeCore.Time.game.getScale()); //Update the simulation by the given deltaTime and the Fudge internal TimeScale
            if (Physics.world.mainCam != null && Physics.settings.debugDraw == true) { //Get Cam from viewport instead of setting it for physics
                Physics.world.debugDraw.begin(); //Updates info about the current projection, resetting the points/lines/triangles that need to be drawn from debug
                Physics.world.oimoWorld.debugDraw(); //Filling the physics world debug informations into the debug rendering handler
            }
        }
        /** Make the given ComponentRigidbody known to the world as a body that is not colliding, but only triggering events. Used internally no interaction needed. */
        registerTrigger(_rigidbody) {
            if (this.triggerBodyList.indexOf(_rigidbody) == -1)
                this.triggerBodyList.push(_rigidbody);
        }
        /** Remove the given ComponentRigidbody the world as viable triggeringBody. Used internally no interaction needed. */
        unregisterTrigger(_rigidbody) {
            let id = this.bodyList.indexOf(_rigidbody);
            this.bodyList.splice(id, 1);
        }
        /** Connect all joints that are not connected yet. Used internally no user interaction needed. This functionality is called and needed to make sure joints connect/disconnect
         * if any of the two paired ComponentRigidbodies change.
         */
        connectJoints() {
            let jointsToConnect = new Array(); //Copy original Array because removing/readding in the connecting process
            this.jointList.forEach(function (value) {
                jointsToConnect.push(value);
            });
            this.jointList.splice(0, this.jointList.length);
            jointsToConnect.forEach((value) => {
                if (value.checkConnection() == false) {
                    FudgeCore.Debug.log("connectBodies");
                    value.connect();
                }
            });
        }
        /**
      * Called internally to inform the physics system that a joint has a change of core properties like ComponentRigidbody and needs to
      * be recreated.
      */
        changeJointStatus(_cmpJoint) {
            this.jointList.push(_cmpJoint);
        }
        /** Giving a ComponentRigidbody a specific identification number so it can be referenced in the loading process. And removed rb's can receive a new id. */
        distributeBodyID() {
            let freeId = 0;
            let free = false;
            this.bodyList.forEach((_value) => {
                if (_value.id != freeId) {
                    free = true;
                }
                else {
                    free = false;
                }
                if (!free) {
                    freeId++;
                }
            });
            return freeId;
        }
        /** Returns the ComponentRigidbody with the given id. Used internally to reconnect joints on loading in the editor. */
        getBodyByID(_id) {
            let body = null;
            this.bodyList.forEach((value) => {
                if (value.id == _id) {
                    body = value;
                }
            });
            return body;
        }
        /** Updates all to the Physics.world known Rigidbodies with their respective world positions/rotations/scalings */
        updateWorldFromWorldMatrix() {
            this.bodyList.forEach(function (value) {
                value.updateFromWorld();
            });
        }
        /** Create a oimoPhysics world. Called once at the beginning if none is existend yet. */
        createWorld() {
            Physics.world.oimoWorld = new OIMO.World();
        }
    }
    /** The PHYSICAL WORLD that gives every [[Node]] with a ComponentRigidbody a physical representation and moves them accordingly to the laws of the physical world. */
    Physics.world = Physics.initializePhysics();
    FudgeCore.Physics = Physics;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
      * Storing and manipulating rotations in the form of quaternions.
      * Constructed out of the 4 components x,y,z,w. Commonly used to calculate rotations in physics engines.
      * Class mostly used internally to bridge the in FUDGE commonly used angles in degree to OimoPhysics quaternion system.
      * @authors Marko Fehrenbach, HFU, 2020
      */
    class Quaternion extends FudgeCore.Mutable {
        constructor(_x = 0, _y = 0, _z = 0, _w = 0) {
            super();
            this.x = _x;
            this.y = _y;
            this.z = _z;
            this.w = _w;
        }
        /** Get/Set the X component of the Quaternion. Real Part */
        get X() {
            return this.x;
        }
        set X(_x) {
            this.x = _x;
        }
        /** Get/Set the Y component of the Quaternion. Real Part */
        get Y() {
            return this.y;
        }
        set Y(_y) {
            this.y = _y;
        }
        /** Get/Set the Z component of the Quaternion. Real Part */
        get Z() {
            return this.z;
        }
        set Z(_z) {
            this.z = _z;
        }
        /** Get/Set the Y component of the Quaternion. Imaginary Part */
        get W() {
            return this.w;
        }
        set W(_w) {
            this.w = _w;
        }
        /**
         * Create quaternion from vector3 angles in degree
         */
        setFromVector3(rollX, pitchY, yawZ) {
            let cy = Math.cos(yawZ * 0.5);
            let sy = Math.sin(yawZ * 0.5);
            let cp = Math.cos(pitchY * 0.5);
            let sp = Math.sin(pitchY * 0.5);
            let cr = Math.cos(rollX * 0.5);
            let sr = Math.sin(rollX * 0.5);
            this.w = cr * cp * cy + sr * sp * sy;
            this.x = sr * cp * cy - cr * sp * sy;
            this.y = cr * sp * cy + sr * cp * sy;
            this.z = cr * cp * sy - sr * sp * cy;
        }
        /**
         * Returns the euler angles in radians as Vector3 from this quaternion.
         */
        toEulerangles() {
            let angles = new FudgeCore.Vector3();
            // roll (x-axis rotation)
            let sinrcosp = 2 * (this.w * this.x + this.y * this.z);
            let cosrcosp = 1 - 2 * (this.x * this.x + this.y * this.y);
            angles.x = Math.atan2(sinrcosp, cosrcosp);
            // pitch (y-axis rotation)
            let sinp = 2 * (this.w * this.y - this.z * this.x);
            if (Math.abs(sinp) >= 1)
                angles.y = this.copysign(Math.PI / 2, sinp); // use 90 degrees if out of range
            else
                angles.y = Math.asin(sinp);
            // yaw (z-axis rotation)
            let sinycosp = 2 * (this.w * this.z + this.x * this.y);
            let cosycosp = 1 - 2 * (this.y * this.y + this.z * this.z);
            angles.z = Math.atan2(sinycosp, cosycosp);
            return angles;
        }
        /**
         * Return angles in degrees as vector3 from this. quaterion
         */
        toDegrees() {
            let angles = this.toEulerangles();
            angles.x = angles.x * (180 / Math.PI);
            angles.y = angles.y * (180 / Math.PI);
            angles.z = angles.z * (180 / Math.PI);
            return angles;
        }
        getMutator() {
            let mutator = {
                x: this.x, y: this.y, z: this.z, w: this.w
            };
            return mutator;
        }
        reduceMutator(_mutator) { }
        /** Copying the sign of a to b */
        copysign(a, b) {
            return b < 0 ? -Math.abs(a) : Math.abs(a);
        }
    }
    FudgeCore.Quaternion = Quaternion;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Ray {
        constructor(_direction = FudgeCore.Vector3.Z(-1), _origin = FudgeCore.Vector3.ZERO(), _length = 1) {
            this.origin = _origin;
            this.direction = _direction;
            this.length = _length;
        }
        /**
         * Returns the point of intersection of this ray with a plane defined by
         * the given point of origin and the planes normal. All values and calculations
         * must be relative to the same coordinate system, preferably the world
         */
        intersectPlane(_origin, _normal) {
            let difference = FudgeCore.Vector3.DIFFERENCE(_origin, this.origin);
            let factor = FudgeCore.Vector3.DOT(difference, _normal) / FudgeCore.Vector3.DOT(this.direction, _normal);
            let intersect = FudgeCore.Vector3.SUM(this.origin, FudgeCore.Vector3.SCALE(this.direction, factor));
            return intersect;
        }
        /**
         * Returns the shortest distance from the ray to the given target point.
         * All values and calculations must be relative to the same coordinate system, preferably the world.
         */
        getDistance(_target) {
            let originToTarget = FudgeCore.Vector3.DIFFERENCE(_target, this.origin);
            let raySection = FudgeCore.Vector3.NORMALIZATION(this.direction, 1);
            let projectedLength = FudgeCore.Vector3.DOT(originToTarget, raySection);
            raySection.scale(projectedLength);
            raySection.add(this.origin);
            let distance = FudgeCore.Vector3.DIFFERENCE(_target, raySection);
            return distance;
        }
    }
    FudgeCore.Ray = Ray;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RayHit {
        constructor(_node = null, _face = 0, _zBuffer = 0) {
            this.node = _node;
            this.face = _face;
            this.zBuffer = _zBuffer;
        }
    }
    FudgeCore.RayHit = RayHit;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * The main interface to the render engine, here WebGL, which is used mainly in the superclass [[RenderOperator]]
     */
    class RenderManager extends FudgeCore.RenderOperator {
        /**
         * Clear the offscreen renderbuffer with the given [[Color]]
         */
        static clear(_color = null) {
            RenderManager.crc3.clearColor(_color.r, _color.g, _color.b, _color.a);
            RenderManager.crc3.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        }
        /**
         * Reset the offscreen framebuffer to the original RenderingContext
         */
        static resetFrameBuffer(_color = null) {
            RenderManager.crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
        }
        //#region RayCast & Picking
        /**
         * Draws the graph for RayCasting starting with the given [[Node]] using the camera given [[ComponentCamera]].
         */
        static drawGraphForRayCast(_node, _cmpCamera) {
            RenderManager.pickBuffers = [];
            //TODO: examine, why switching blendFunction is necessary 
            FudgeCore.RenderOperator.crc3.blendFunc(1, 0);
            RenderManager.drawGraph(_node, _cmpCamera, RenderManager.drawNodeForRayCast);
            FudgeCore.RenderOperator.crc3.blendFunc(WebGL2RenderingContext.DST_ALPHA, WebGL2RenderingContext.ONE_MINUS_DST_ALPHA);
            RenderManager.resetFrameBuffer();
            return RenderManager.pickBuffers;
        }
        /**
         * Browses through the buffers (previously created with [[drawGraphForRayCast]]) of the size given
         * and returns an unsorted list of the values at the given position, representing node-ids and depth information as [[RayHit]]s
         */
        static pickNodeAt(_pos, _pickBuffers, _rect) {
            let hits = [];
            for (let pickBuffer of _pickBuffers) {
                RenderManager.crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, pickBuffer.frameBuffer);
                // TODO: instead of reading all data and afterwards pick the pixel, read only the pixel!
                let data = new Uint8Array(_rect.width * _rect.height * 4);
                RenderManager.crc3.readPixels(0, 0, _rect.width, _rect.height, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, data);
                let pixel = _pos.x + _rect.width * _pos.y;
                // let zBuffer: number = data[4 * pixel + 1] + data[4 * pixel + 2] / 256;
                let zBuffer = data[4 * pixel + 0];
                let hit = new FudgeCore.RayHit(pickBuffer.node, 0, zBuffer);
                hits.push(hit);
            }
            return hits;
        }
        //#endregion
        //#region Transformation & Lights
        /**
         * Recursively iterates over the graph starting with the node given, recalculates all world transforms,
         * collects all lights and feeds all shaders used in the graph with these lights
         */
        static setupTransformAndLights(_node, _world = FudgeCore.Matrix4x4.IDENTITY(), _lights = new Map(), _shadersUsed = null) {
            RenderManager.timestampUpdate = performance.now();
            let firstLevel = (_shadersUsed == null);
            if (firstLevel)
                _shadersUsed = [];
            let world = _world;
            let cmpTransform = _node.cmpTransform;
            if (cmpTransform)
                world = FudgeCore.Matrix4x4.MULTIPLICATION(_world, cmpTransform.local);
            _node.mtxWorld.set(world); // overwrite readonly mtxWorld of node
            _node.timestampUpdate = RenderManager.timestampUpdate;
            let cmpLights = _node.getComponents(FudgeCore.ComponentLight);
            for (let cmpLight of cmpLights) {
                let type = cmpLight.light.getType();
                let lightsOfType = _lights.get(type);
                if (!lightsOfType) {
                    lightsOfType = [];
                    _lights.set(type, lightsOfType);
                }
                lightsOfType.push(cmpLight);
            }
            let cmpMaterial = _node.getComponent(FudgeCore.ComponentMaterial);
            if (cmpMaterial) {
                let shader = cmpMaterial.material.getShader();
                if (_shadersUsed.indexOf(shader) < 0)
                    _shadersUsed.push(shader);
            }
            for (let child of _node.getChildren()) {
                RenderManager.setupTransformAndLights(child, world, _lights, _shadersUsed);
            }
            if (firstLevel)
                for (let shader of _shadersUsed)
                    RenderManager.setLightsInShader(shader, _lights);
        }
        //#endregion
        //#region Drawing
        /**
         * The main rendering function to be called from [[Viewport]].
         * Draws the graph starting with the given [[Node]] using the camera given [[ComponentCamera]].
         */
        static drawGraph(_node, _cmpCamera, _drawNode = RenderManager.drawNode) {
            let matrix = FudgeCore.Matrix4x4.IDENTITY();
            if (_node.getParent())
                matrix = _node.getParent().mtxWorld;
            // TODO: Move physics rendering to RenderPhysics extension of RenderManager
            if (FudgeCore.Physics.world && FudgeCore.Physics.world.mainCam != _cmpCamera)
                FudgeCore.Physics.world.mainCam = _cmpCamera; //DebugDraw needs to know the main camera beforehand, _cmpCamera is the viewport camera. | Marko Fehrenbach, HFU 2020
            RenderManager.setupPhysicalTransform(_node);
            RenderManager.setupTransformAndLights(_node, matrix);
            //if (Physics.settings && Physics.settings.debugMode != PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY) //Give users the possibility to only show physics displayed | Marko Fehrenbach, HFU 2020
            RenderManager.drawGraphRecursive(_node, _cmpCamera, _drawNode);
            if (FudgeCore.Physics.settings && FudgeCore.Physics.settings.debugDraw == true) {
                FudgeCore.Physics.world.debugDraw.end();
            }
        }
        /**
         * Recursivly iterates over the graph and renders each node and all successors with the given render function
         */
        static drawGraphRecursive(_node, _cmpCamera, _drawNode = RenderManager.drawNode) {
            // TODO: see if third parameter _world?: Matrix4x4 would be usefull
            if (!_node.isActive)
                return;
            let finalTransform;
            let cmpMesh = _node.getComponent(FudgeCore.ComponentMesh);
            if (cmpMesh) // TODO: careful when using particlesystem, pivot must not change node position
                finalTransform = FudgeCore.Matrix4x4.MULTIPLICATION(_node.mtxWorld, cmpMesh.pivot);
            else
                finalTransform = _node.mtxWorld; // caution, RenderManager is a reference...
            // multiply camera matrix
            let projection = FudgeCore.Matrix4x4.MULTIPLICATION(_cmpCamera.ViewProjectionMatrix, finalTransform);
            // TODO: create drawNode method for particle system using _node.mtxWorld instead of finalTransform
            _drawNode(_node, finalTransform, projection);
            // RenderParticles.drawParticles();
            for (let name in _node.getChildren()) {
                let childNode = _node.getChildren()[name];
                RenderManager.drawGraphRecursive(childNode, _cmpCamera, _drawNode); //, world);
            }
            FudgeCore.Recycler.store(projection);
            if (finalTransform != _node.mtxWorld)
                FudgeCore.Recycler.store(finalTransform);
        }
        /**
         * The standard render function for drawing a single node
         */
        static drawNode(_node, _finalTransform, _projection, _lights, _cmpCamera) {
            try {
                let cmpMaterial = _node.getComponent(FudgeCore.ComponentMaterial);
                let mesh = _node.getComponent(FudgeCore.ComponentMesh).mesh;
                // RenderManager.setLightsInShader(shader, _lights);
                RenderManager.draw(mesh, cmpMaterial, _finalTransform, _projection); //, _lights);
            }
            catch (_error) {
                // Debug.error(_error);
            }
            //Should be drawn only once, last after anything else, which i believe it does because graphic card only draws each pixel in a certain depth once | Marko Fehrenbach
            // if (Physics.settings.debugDraw == true) {
            //   Physics.world.debugDraw.end();
            // }
        }
        //#endregion
        //#region Picking
        /**
         * The render function for drawing buffers for picking. Renders each node on a dedicated buffer with id and depth values instead of colors
         */
        static drawNodeForRayCast(_node, _finalTransform, _projection, _lights) {
            // TODO: look into SSBOs!
            let target = RenderManager.getRayCastTexture();
            const framebuffer = RenderManager.crc3.createFramebuffer();
            // render to our targetTexture by binding the framebuffer
            RenderManager.crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, framebuffer);
            // attach the texture as the first color attachment
            const attachmentPoint = WebGL2RenderingContext.COLOR_ATTACHMENT0;
            RenderManager.crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, attachmentPoint, WebGL2RenderingContext.TEXTURE_2D, target, 0);
            try {
                let mesh = _node.getComponent(FudgeCore.ComponentMesh).mesh;
                FudgeCore.ShaderRayCast.useProgram();
                let pickBuffer = { node: _node, texture: target, frameBuffer: framebuffer };
                RenderManager.pickBuffers.push(pickBuffer);
                mesh.useRenderBuffers(FudgeCore.ShaderRayCast, _finalTransform, _projection, RenderManager.pickBuffers.length);
                FudgeCore.RenderOperator.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, mesh.renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
            }
            catch (_error) {
                //
            }
            // make texture available to onscreen-display
        }
        /**
         * Creates a texture buffer to be uses as pick-buffer
         */
        static getRayCastTexture() {
            // create to render to
            const targetTextureWidth = RenderManager.getViewportRectangle().width;
            const targetTextureHeight = RenderManager.getViewportRectangle().height;
            const targetTexture = RenderManager.crc3.createTexture();
            RenderManager.crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, targetTexture);
            {
                const internalFormat = WebGL2RenderingContext.RGBA8;
                const format = WebGL2RenderingContext.RGBA;
                const type = WebGL2RenderingContext.UNSIGNED_BYTE;
                RenderManager.crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, internalFormat, targetTextureWidth, targetTextureHeight, 0, format, type, null);
                // set the filtering so we don't need mips
                RenderManager.crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR);
                RenderManager.crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.CLAMP_TO_EDGE);
                RenderManager.crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.CLAMP_TO_EDGE);
            }
            return targetTexture;
        }
        //#endregion
        //#region Lights
        /**
         * Set light data in shaders
         */
        static setLightsInShader(_shader, _lights) {
            _shader.useProgram();
            let uni = _shader.uniforms;
            // Ambient
            let ambient = uni["u_ambient.color"];
            if (ambient) {
                let cmpLights = _lights.get(FudgeCore.LightAmbient);
                if (cmpLights) {
                    // TODO: add up ambient lights to a single color
                    let result = new FudgeCore.Color(0, 0, 0, 1);
                    for (let cmpLight of cmpLights)
                        result.add(cmpLight.light.color);
                    FudgeCore.RenderOperator.crc3.uniform4fv(ambient, result.getArray());
                }
            }
            // Directional
            let nDirectional = uni["u_nLightsDirectional"];
            if (nDirectional) {
                let cmpLights = _lights.get(FudgeCore.LightDirectional);
                if (cmpLights) {
                    let n = cmpLights.length;
                    FudgeCore.RenderOperator.crc3.uniform1ui(nDirectional, n);
                    for (let i = 0; i < n; i++) {
                        let cmpLight = cmpLights[i];
                        FudgeCore.RenderOperator.crc3.uniform4fv(uni[`u_directional[${i}].color`], cmpLight.light.color.getArray());
                        let direction = FudgeCore.Vector3.Z();
                        direction.transform(cmpLight.pivot, false);
                        direction.transform(cmpLight.getContainer().mtxWorld);
                        FudgeCore.RenderOperator.crc3.uniform3fv(uni[`u_directional[${i}].direction`], direction.get());
                    }
                }
            }
        }
        //#endregion
        //#region Physics
        /**
        * Physics Part -> Take all nodes with cmpRigidbody, and overwrite their local position/rotation with the one coming from
        * the rb component, which is the new "local" WORLD position.
        */
        static setupPhysicalTransform(_node) {
            if (FudgeCore.Physics.world != null && FudgeCore.Physics.world.getBodyList().length >= 1) {
                let mutator = {};
                for (let name in _node.getChildren()) {
                    let childNode = _node.getChildren()[name];
                    RenderManager.setupPhysicalTransform(childNode);
                    let cmpRigidbody = childNode.getComponent(FudgeCore.ComponentRigidbody);
                    if (childNode.getComponent(FudgeCore.ComponentTransform) != null && cmpRigidbody != null) {
                        cmpRigidbody.checkCollisionEvents();
                        cmpRigidbody.checkTriggerEvents();
                        if (cmpRigidbody.physicsType != FudgeCore.PHYSICS_TYPE.KINEMATIC) { //Case of Dynamic/Static Rigidbody
                            //Override any position/rotation, Physical Objects do not know hierachy unless it's established through physics
                            mutator["rotation"] = cmpRigidbody.getRotation();
                            mutator["translation"] = cmpRigidbody.getPosition();
                            childNode.mtxLocal.mutate(mutator);
                        }
                        if (cmpRigidbody.physicsType == FudgeCore.PHYSICS_TYPE.KINEMATIC) { //Case of Kinematic Rigidbody
                            cmpRigidbody.setPosition(childNode.mtxWorld.translation);
                            cmpRigidbody.setRotation(childNode.mtxWorld.rotation);
                        }
                    }
                }
            }
        }
    }
    RenderManager.rectClip = new FudgeCore.Rectangle(-1, 1, 2, -2);
    FudgeCore.RenderManager = RenderManager;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderParticles extends FudgeCore.RenderManager {
        static drawParticles() {
            // console.log(RenderParticles.crc3);
        }
    }
    FudgeCore.RenderParticles = RenderParticles;
})(FudgeCore || (FudgeCore = {}));
// / <reference path="../Coat/Coat.ts"/>
var FudgeCore;
// / <reference path="../Coat/Coat.ts"/>
(function (FudgeCore) {
    /**
     * Static superclass for the representation of WebGl shaderprograms.
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    var Shader_1;
    // TODO: define attribute/uniforms as layout and use those consistently in shaders
    let Shader = Shader_1 = class Shader {
        /** The type of coat that can be used with this shader to create a material */
        static getCoat() { return null; }
        static getVertexShaderSource() { return null; }
        static getFragmentShaderSource() { return null; }
        static deleteProgram() { }
        static useProgram() { }
        static createProgram() { }
        static registerSubclass(_subclass) { return Shader_1.subclasses.push(_subclass) - 1; }
    };
    /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
    Shader.baseClass = Shader_1;
    /** list of all the subclasses derived from this class, if they registered properly*/
    Shader.subclasses = [];
    Shader = Shader_1 = __decorate([
        FudgeCore.RenderInjectorShader.decorate
    ], Shader);
    FudgeCore.Shader = Shader;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    var ShaderFlat_1;
    /**
     * Single color shading
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    let ShaderFlat = ShaderFlat_1 = class ShaderFlat extends FudgeCore.Shader {
        static getCoat() {
            return FudgeCore.CoatColored;
        }
        static getVertexShaderSource() {
            return `#version 300 es

                    struct LightAmbient {
                        vec4 color;
                    };
                    struct LightDirectional {
                        vec4 color;
                        vec3 direction;
                    };

                    const uint MAX_LIGHTS_DIRECTIONAL = 10u;

                    in vec3 a_position;
                    in vec3 a_normal;
                    uniform mat4 u_world;
                    uniform mat4 u_projection;

                    uniform LightAmbient u_ambient;
                    uniform uint u_nLightsDirectional;
                    uniform LightDirectional u_directional[MAX_LIGHTS_DIRECTIONAL];
                    flat out vec4 v_color;
                    
                    void main() {   
                        gl_Position = u_projection * vec4(a_position, 1.0);
                        vec3 normal = normalize(mat3(u_world) * a_normal);

                        v_color = u_ambient.color;
                        for (uint i = 0u; i < u_nLightsDirectional; i++) {
                            float illumination = -dot(normal, u_directional[i].direction);
                            if (illumination > 0.0f)
                                v_color += illumination * u_directional[i].color; // vec4(1,1,1,1); // 
                        }
                        v_color.a = 1.0;
                    }`;
        }
        static getFragmentShaderSource() {
            return `#version 300 es
                    precision mediump float;

                    uniform vec4 u_color;
                    flat in vec4 v_color;
                    out vec4 frag;
                    
                    void main() {
                        frag = u_color * v_color;
                    }`;
        }
    };
    ShaderFlat.iSubclass = FudgeCore.Shader.registerSubclass(ShaderFlat_1);
    ShaderFlat = ShaderFlat_1 = __decorate([
        FudgeCore.RenderInjectorShader.decorate
    ], ShaderFlat);
    FudgeCore.ShaderFlat = ShaderFlat;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Matcap (Material Capture) shading. The texture provided by the coat is used as a matcap material.
     * Implementation based on https://www.clicktorelease.com/blog/creating-spherical-environment-mapping-shader/
     * @authors Simon Storl-Schulke, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ShaderMatCap extends FudgeCore.Shader {
        static getCoat() {
            return FudgeCore.CoatMatCap;
        }
        static getVertexShaderSource() {
            return `#version 300 es

                    in vec3 a_position;
                    in vec3 a_normal;

                    uniform mat4 u_projection;

                    out vec2 texcoords_smooth;
                    flat out vec2 texcoords_flat;

                    void main() {
                        texcoords_smooth = normalize(mat3(u_projection) * a_normal).xy * 0.5 - 0.5;
                        texcoords_flat = texcoords_smooth;
                        gl_Position = u_projection * vec4(a_position, 1.0);
                    }`;
        }
        static getFragmentShaderSource() {
            return `#version 300 es
                    precision mediump float;
                    
                    uniform vec4 u_tint_color;
                    uniform int shade_smooth;
                    uniform sampler2D u_texture;
                    
                    in vec2 texcoords_smooth;
                    flat in vec2 texcoords_flat;

                    out vec4 frag;

                    void main() {

                        if (shade_smooth > 0) {
                          frag = u_tint_color * texture(u_texture, texcoords_smooth) * 2.0;
                        } else {
                          frag = u_tint_color * texture(u_texture, texcoords_flat) * 2.0;
                        }
                    }`;
        }
    }
    ShaderMatCap.iSubclass = FudgeCore.Shader.registerSubclass(ShaderMatCap);
    FudgeCore.ShaderMatCap = ShaderMatCap;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Renders for Raycasting
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ShaderRayCast extends FudgeCore.Shader {
        static getVertexShaderSource() {
            return `#version 300 es

                    in vec3 a_position;
                    uniform mat4 u_projection;
                    
                    void main() {   
                        gl_Position = u_projection * vec4(a_position, 1.0);
                    }`;
        }
        static getFragmentShaderSource() {
            return `#version 300 es
                    precision mediump float;
                    precision highp int;
                    
                    uniform int u_id;
                    out vec4 frag;
                    
                    void main() {
                       float id = float(u_id)/ 256.0;
                       float upperbyte = trunc(gl_FragCoord.z * 256.0) / 256.0;
                       float lowerbyte = fract(gl_FragCoord.z * 256.0);
                       frag = vec4(gl_FragCoord.z, upperbyte, lowerbyte, 1.0);
                    }`;
        }
    }
    FudgeCore.ShaderRayCast = ShaderRayCast;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Textured shading
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ShaderTexture extends FudgeCore.Shader {
        static getCoat() {
            return FudgeCore.CoatTextured;
        }
        static getVertexShaderSource() {
            return `#version 300 es

                in vec3 a_position;
                in vec2 a_textureUVs;
                uniform mat4 u_projection;
                uniform mat3 u_pivot;
                out vec2 v_textureUVs;

                void main() {  
                    gl_Position = u_projection * vec4(a_position, 1.0);
                    // v_textureUVs = a_textureUVs;
                    v_textureUVs = vec2(u_pivot * vec3(a_textureUVs, 1.0)).xy;
                }`;
        }
        static getFragmentShaderSource() {
            return `#version 300 es
                precision mediump float;
                
                in vec2 v_textureUVs;
                uniform vec4 u_color;
                uniform sampler2D u_texture;
                // uniform vec4 u_colorBackground; // maybe a material background color can shine through... but where and with which intensity?
                out vec4 frag;
                
                void main() {
                    vec4 colorTexture = texture(u_texture, v_textureUVs);
                    frag = u_color * colorTexture;
                    //frag = vec4(colorTexture.r * 1.0, colorTexture.g * 0.4, colorTexture.b * 0.1, colorTexture.a * 1.5);//u_color;
                    //frag = colorTexture;
                    if (frag.a < 0.01)
                      discard;
            }`;
        }
    }
    ShaderTexture.iSubclass = FudgeCore.Shader.registerSubclass(ShaderTexture);
    FudgeCore.ShaderTexture = ShaderTexture;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Single color shading
     * @authors Jascha Karagöl, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class ShaderUniColor extends FudgeCore.Shader {
        static getCoat() {
            return FudgeCore.CoatColored;
        }
        static getVertexShaderSource() {
            return `#version 300 es

                    in vec3 a_position;
                    uniform mat4 u_projection;
                    
                    void main() {   
                        gl_Position = u_projection * vec4(a_position, 1.0);
                    }`;
        }
        static getFragmentShaderSource() {
            return `#version 300 es
                    precision mediump float;
                    
                    uniform vec4 u_color;
                    out vec4 frag;
                    
                    void main() {
                       frag = u_color;
                    }`;
        }
    }
    ShaderUniColor.iSubclass = FudgeCore.Shader.registerSubclass(ShaderUniColor);
    FudgeCore.ShaderUniColor = ShaderUniColor;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Baseclass for different kinds of textures.
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Texture extends FudgeCore.Mutable {
        constructor() {
            super(...arguments);
            this.name = "Texture";
        }
        useRenderData() { }
        reduceMutator(_mutator) {
            // delete _mutator.idResource; 
        }
    }
    FudgeCore.Texture = Texture;
    /**
     * Texture created from an existing image
     */
    let TextureImage = class TextureImage extends Texture {
        constructor(_url) {
            super();
            this.image = null;
            this.idResource = undefined;
            if (_url) {
                this.load(_url);
                this.name = _url.toString().split("/").pop();
            }
            FudgeCore.Project.register(this);
        }
        /**
         * Asynchronously loads the image from the given url
         */
        async load(_url) {
            this.url = _url;
            this.image = new Image();
            // const response: Response = await window.fetch(this.url);
            // const blob: Blob = await response.blob();
            // let objectURL: string = URL.createObjectURL(blob);
            // this.image.src = objectURL;
            return new Promise((resolve, reject) => {
                this.image.addEventListener("load", () => {
                    this.renderData = null; // refresh render data on next draw call
                    resolve();
                });
                this.image.addEventListener("error", () => reject());
                this.image.src = new URL(this.url.toString(), FudgeCore.Project.baseURL).toString();
            });
        }
        //#region Transfer
        serialize() {
            return {
                url: this.url,
                idResource: this.idResource,
                name: this.name,
                type: this.type // serialize for editor views
            };
        }
        async deserialize(_serialization) {
            FudgeCore.Project.register(this, _serialization.idResource);
            await this.load(_serialization.url);
            this.name = _serialization.name;
            // this.type is an accessor of Mutable doesn't need to be deserialized
            return this;
        }
        async mutate(_mutator) {
            if (_mutator.url != this.url.toString())
                await this.load(_mutator.url);
            // except url from mutator for further processing
            delete (_mutator.url);
            super.mutate(_mutator);
            // TODO: examine necessity to reconstruct, if mutator is kept by caller
            // _mutator.url = this.url; 
        }
    };
    TextureImage = __decorate([
        FudgeCore.RenderInjectorTexture.decorate
    ], TextureImage);
    FudgeCore.TextureImage = TextureImage;
    /**
     * Texture created from a canvas
     */
    class TextureCanvas extends Texture {
    }
    FudgeCore.TextureCanvas = TextureCanvas;
    /**
     * Texture created from a FUDGE-Sketch
     */
    class TextureSketch extends TextureCanvas {
    }
    FudgeCore.TextureSketch = TextureSketch;
    /**
     * Texture created from an HTML-page
     */
    class TextureHTML extends TextureCanvas {
    }
    FudgeCore.TextureHTML = TextureHTML;
})(FudgeCore || (FudgeCore = {}));
// /<reference path="../Event/Event.ts"/>
// /<reference path="../Time/Time.ts"/>
var FudgeCore;
// /<reference path="../Event/Event.ts"/>
// /<reference path="../Time/Time.ts"/>
(function (FudgeCore) {
    /**
     * Determines the mode a loop runs in
     */
    let LOOP_MODE;
    (function (LOOP_MODE) {
        /** Loop cycles controlled by window.requestAnimationFrame */
        LOOP_MODE["FRAME_REQUEST"] = "frameRequest";
        /** Loop cycles with the given framerate in [[Time]].game */
        LOOP_MODE["TIME_GAME"] = "timeGame";
        /** Loop cycles with the given framerate in realtime, independent of [[Time]].game */
        LOOP_MODE["TIME_REAL"] = "timeReal";
    })(LOOP_MODE = FudgeCore.LOOP_MODE || (FudgeCore.LOOP_MODE = {}));
    /**
     * Core loop of a Fudge application. Initializes automatically and must be started explicitly.
     * It then fires [[EVENT]].LOOP\_FRAME to all added listeners at each frame
     *
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Loop extends FudgeCore.EventTargetStatic {
        /**
         * Starts the loop with the given mode and fps
         * @param _mode
         * @param _fps Is only applicable in TIME-modes
         * @param _syncWithAnimationFrame Experimental and only applicable in TIME-modes. Should defer the loop-cycle until the next possible animation frame.
         */
        static start(_mode = LOOP_MODE.FRAME_REQUEST, _fps = 60, _syncWithAnimationFrame = false) {
            Loop.stop();
            Loop.timeStartGame = FudgeCore.Time.game.get();
            Loop.timeStartReal = performance.now();
            Loop.timeLastFrameGame = Loop.timeStartGame;
            Loop.timeLastFrameReal = Loop.timeStartReal;
            Loop.fpsDesired = (_mode == LOOP_MODE.FRAME_REQUEST) ? 60 : _fps;
            Loop.framesToAverage = Loop.fpsDesired;
            Loop.timeLastFrameGameAvg = Loop.timeLastFrameRealAvg = 1000 / Loop.fpsDesired;
            Loop.mode = _mode;
            Loop.syncWithAnimationFrame = _syncWithAnimationFrame;
            let log = `Loop starting in mode ${Loop.mode}`;
            if (Loop.mode != LOOP_MODE.FRAME_REQUEST)
                log += ` with attempted ${_fps} fps`;
            FudgeCore.Debug.fudge(log);
            switch (_mode) {
                case LOOP_MODE.FRAME_REQUEST:
                    Loop.loopFrame();
                    break;
                case LOOP_MODE.TIME_REAL:
                    Loop.idIntervall = window.setInterval(Loop.loopTime, 1000 / Loop.fpsDesired);
                    Loop.loopTime();
                    break;
                case LOOP_MODE.TIME_GAME:
                    Loop.idIntervall = FudgeCore.Time.game.setTimer(1000 / Loop.fpsDesired, 0, Loop.loopTime);
                    Loop.loopTime();
                    break;
                default:
                    break;
            }
            Loop.running = true;
        }
        /**
         * Stops the loop
         */
        static stop() {
            if (!Loop.running)
                return;
            switch (Loop.mode) {
                case LOOP_MODE.FRAME_REQUEST:
                    window.cancelAnimationFrame(Loop.idRequest);
                    break;
                case LOOP_MODE.TIME_REAL:
                    window.clearInterval(Loop.idIntervall);
                    window.cancelAnimationFrame(Loop.idRequest);
                    break;
                case LOOP_MODE.TIME_GAME:
                    FudgeCore.Time.game.deleteTimer(Loop.idIntervall);
                    window.cancelAnimationFrame(Loop.idRequest);
                    break;
                default:
                    break;
            }
            Loop.running = false;
            FudgeCore.Debug.fudge("Loop stopped!");
        }
        static continue() {
            if (Loop.running)
                return;
            Loop.start(Loop.mode, Loop.fpsDesired, Loop.syncWithAnimationFrame);
        }
        static getFpsGameAverage() {
            return 1000 / Loop.timeLastFrameGameAvg;
        }
        static getFpsRealAverage() {
            return 1000 / Loop.timeLastFrameRealAvg;
        }
        static loop() {
            let time;
            time = performance.now();
            Loop.timeFrameReal = time - Loop.timeLastFrameReal;
            Loop.timeLastFrameReal = time;
            time = FudgeCore.Time.game.get();
            Loop.timeFrameGame = time - Loop.timeLastFrameGame;
            Loop.timeLastFrameGame = time;
            Loop.timeLastFrameGameAvg = ((Loop.framesToAverage - 1) * Loop.timeLastFrameGameAvg + Loop.timeFrameGame) / Loop.framesToAverage;
            Loop.timeLastFrameRealAvg = ((Loop.framesToAverage - 1) * Loop.timeLastFrameRealAvg + Loop.timeFrameReal) / Loop.framesToAverage;
            // TODO: consider LoopEvent which conveys information such as timeElapsed etc...
            let event = new Event("loopFrame" /* LOOP_FRAME */);
            Loop.targetStatic.dispatchEvent(event);
        }
        static loopFrame() {
            Loop.loop();
            Loop.idRequest = window.requestAnimationFrame(Loop.loopFrame);
        }
        static loopTime() {
            if (Loop.syncWithAnimationFrame)
                Loop.idRequest = window.requestAnimationFrame(Loop.loop);
            else
                Loop.loop();
        }
    }
    /** The gametime the loop was started, overwritten at each start */
    Loop.timeStartGame = 0;
    /** The realtime the loop was started, overwritten at each start */
    Loop.timeStartReal = 0;
    /** The gametime elapsed since the last loop cycle */
    Loop.timeFrameGame = 0;
    /** The realtime elapsed since the last loop cycle */
    Loop.timeFrameReal = 0;
    Loop.timeLastFrameGame = 0;
    Loop.timeLastFrameReal = 0;
    Loop.timeLastFrameGameAvg = 0;
    Loop.timeLastFrameRealAvg = 0;
    Loop.running = false;
    Loop.mode = LOOP_MODE.FRAME_REQUEST;
    Loop.idIntervall = 0;
    Loop.idRequest = 0;
    Loop.fpsDesired = 30;
    Loop.framesToAverage = 30;
    Loop.syncWithAnimationFrame = false;
    FudgeCore.Loop = Loop;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Instances of this class generate a timestamp that correlates with the time elapsed since the start of the program but allows for resetting and scaling.
     * Supports [[Timer]]s similar to window.setInterval but with respect to the scaled time.
     * All time values are given in milliseconds
     *
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Time extends FudgeCore.EventTargetƒ {
        constructor() {
            super();
            this.timers = {};
            this.idTimerAddedLast = 0;
            this.start = performance.now();
            this.scale = 1.0;
            this.offset = 0.0;
            this.lastCallToElapsed = 0.0;
        }
        /**
         * Returns the game-time-object which starts automatically and serves as base for various internal operations.
         */
        // public static get game(): Time {
        //   return Time.gameTime;
        // }
        static getUnits(_milliseconds) {
            let units = {};
            units.asSeconds = _milliseconds / 1000;
            units.asMinutes = units.asSeconds / 60;
            units.asHours = units.asMinutes / 60;
            units.hours = Math.floor(units.asHours);
            units.minutes = Math.floor(units.asMinutes) % 60;
            units.seconds = Math.floor(units.asSeconds) % 60;
            units.fraction = _milliseconds % 1000;
            units.thousands = _milliseconds % 10;
            units.hundreds = _milliseconds % 100 - units.thousands;
            units.tenths = units.fraction - units.hundreds - units.thousands;
            return units;
        }
        //#region Get/Set time and scaling
        /**
         * Retrieves the current scaled timestamp of this instance in milliseconds
         */
        get() {
            return this.offset + this.scale * (performance.now() - this.start);
        }
        /**
         * Returns the remaining time to the given point of time
         */
        getRemainder(_to) {
            return _to - this.get();
        }
        /**
         * (Re-) Sets the timestamp of this instance
         * @param _time The timestamp to represent the current time (default 0.0)
         */
        set(_time = 0) {
            this.offset = _time;
            this.start = performance.now();
            this.getElapsedSincePreviousCall();
        }
        /**
         * Sets the scaling of this time, allowing for slowmotion (<1) or fastforward (>1)
         * @param _scale The desired scaling (default 1.0)
         */
        setScale(_scale = 1.0) {
            this.set(this.get());
            this.scale = _scale;
            //TODO: catch scale=0
            this.rescaleAllTimers();
            this.getElapsedSincePreviousCall();
            this.dispatchEvent(new Event("timeScaled" /* TIME_SCALED */));
        }
        /**
         * Retrieves the current scaling of this time
         */
        getScale() {
            return this.scale;
        }
        /**
         * Retrieves the offset of this time
         */
        getOffset() {
            return this.offset;
        }
        /**
         * Retrieves the scaled time in milliseconds passed since the last call to this method
         * Automatically reset at every call to set(...) and setScale(...)
         */
        getElapsedSincePreviousCall() {
            let current = this.get();
            let elapsed = current - this.lastCallToElapsed;
            this.lastCallToElapsed = current;
            return elapsed;
        }
        //#endregion
        //#region Timers
        /**
         * Returns a Promise<void> to be resolved after the time given. To be used with async/await
         */
        delay(_lapse) {
            return new Promise(_resolve => this.setTimer(_lapse, 1, () => _resolve()));
        }
        // TODO: examine if web-workers would enhance performance here!
        /**
         * Stops and deletes all [[Timer]]s attached. Should be called before this Time-object leaves scope
         */
        clearAllTimers() {
            for (let id in this.timers) {
                this.deleteTimer(Number(id));
            }
        }
        /**
         * Deletes [[Timer]] found using the internal id of the connected interval-object
         * @param _id
         */
        deleteTimerByItsInternalId(_id) {
            for (let id in this.timers) {
                let timer = this.timers[id];
                if (timer.id == _id) {
                    timer.clear();
                    delete this.timers[id];
                    // TODO: check if an early out is OK here... should be!
                }
            }
        }
        /**
         * Installs a timer at this time object
         * @param _lapse The object-time to elapse between the calls to _callback
         * @param _count The number of calls desired, 0 = Infinite
         * @param _handler The function to call each the given lapse has elapsed
         * @param _arguments Additional parameters to pass to callback function
         */
        setTimer(_lapse, _count, _handler, ..._arguments) {
            // tslint:disable-next-line: no-unused-expression
            new FudgeCore.Timer(this, _lapse, _count, _handler, _arguments);
            //this.addTimer(timer);
            return this.idTimerAddedLast;
        }
        /**
         * This method is called internally by [[Time]] and [[Timer]] and must not be called otherwise
         */
        addTimer(_timer) {
            this.timers[++this.idTimerAddedLast] = _timer;
            return this.idTimerAddedLast;
        }
        /**
         * Deletes the timer with the id given by this time object
         */
        deleteTimer(_id) {
            let timer = this.timers[_id];
            if (!timer)
                return;
            timer.clear();
            delete this.timers[_id];
        }
        /**
         * Returns a reference to the timer with the given id or null if not found.
         */
        getTimer(_id) {
            return this.timers[_id];
        }
        /**
         * Returns a copy of the list of timers currently installed on this time object
         */
        getTimers() {
            let result = {};
            return Object.assign(result, this.timers);
        }
        /**
         * Returns true if there are [[Timers]] installed to this
         */
        hasTimers() {
            return (Object.keys(this.timers).length > 0);
        }
        /**
         * Recreates [[Timer]]s when scaling changes
         */
        rescaleAllTimers() {
            for (let id in this.timers) {
                let timer = this.timers[id];
                timer.clear();
                if (!this.scale)
                    // Time has stopped, no need to replace cleared timers
                    continue;
                this.timers[id] = timer.installCopy();
            }
        }
    }
    /** Standard game time starting automatically with the application */
    Time.game = new Time();
    FudgeCore.Time = Time;
    //#endregion
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * A [[Timer]]-instance internally uses window.setInterval to call a given handler with a given frequency a given number of times,
     * passing an [[TimerEventƒ]]-instance with additional information and given arguments.
     * The frequency scales with the [[Time]]-instance the [[Timer]]-instance is attached to.
     *
     * @author Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class Timer {
        /**
         * Creates a [[Timer]] instance.
         * @param _time The [[Time]] instance, the timer attaches to
         * @param _elapse The time in milliseconds to elapse, to the next call of _handler, measured in _time
         * @param _count The desired number of calls to _handler, Timer deinstalls automatically after last call. Passing 0 invokes infinite calls
         * @param _handler The [[TimerHandler]] instance to call
         * @param _arguments Additional arguments to pass to _handler
         *
         * TODO: for proper handling and deletion, use Time.setTimer instead of instantiating timers yourself.
         */
        constructor(_time, _elapse, _count, _handler, ..._arguments) {
            this.time = _time;
            this.elapse = _elapse;
            this.event = new FudgeCore.EventTimer(this, _arguments);
            this.handler = _handler;
            this.count = _count;
            let scale = Math.abs(_time.getScale());
            if (!scale) {
                // Time is stopped, timer won't be active
                this.active = false;
                return;
            }
            this.timeoutReal = this.elapse / scale;
            let callback = () => {
                if (!this.active)
                    return;
                this.event.lastCall = (this.count == 1);
                _handler(this.event);
                this.event.firstCall = false;
                if (this.count > 0)
                    if (--this.count == 0)
                        _time.deleteTimerByItsInternalId(this.idWindow);
            };
            this.idWindow = window.setInterval(callback, this.timeoutReal, _arguments);
            this.active = true;
            _time.addTimer(this);
        }
        /**
         * Returns the window-id of the timer, which was returned by setInterval
         */
        get id() {
            return this.idWindow;
        }
        /**
         * Returns the time-intervall for calls to the handler
         */
        get lapse() {
            return this.elapse;
        }
        /**
         * Attaches a copy of this at its current state to the same [[Time]]-instance. Used internally when rescaling [[Time]]
         */
        installCopy() {
            return new Timer(this.time, this.elapse, this.count, this.handler, this.event.arguments);
        }
        /**
         * Clears the timer, removing it from the interval-timers handled by window
         */
        clear() {
            // if (this.type == TIMER_TYPE.TIMEOUT) {
            //     if (this.active)
            //         // save remaining time to timeout as new timeout for restart
            //         this.timeout = this.timeout * (1 - (performance.now() - this.startTimeReal) / this.timeoutReal);
            //     window.clearTimeout(this.id);
            // }
            // else
            // TODO: reusing timer starts interval anew. Should be remaining interval as timeout, then starting interval anew 
            window.clearInterval(this.idWindow);
            this.active = false;
        }
    }
    FudgeCore.Timer = Timer;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Handles file transfer from a Fudge-Browserapp to the local filesystem without a local server.
     * Saves to the download-path given by the browser, loads from the player's choice.
     */
    class FileIoBrowserLocal extends FudgeCore.EventTargetStatic {
        // TODO: refactor to async function to be handled using promise, instead of using event target
        static load() {
            FileIoBrowserLocal.selector = document.createElement("input");
            FileIoBrowserLocal.selector.type = "file";
            FileIoBrowserLocal.selector.multiple = true;
            FileIoBrowserLocal.selector.hidden = true;
            FileIoBrowserLocal.selector.addEventListener("change", FileIoBrowserLocal.handleFileSelect);
            document.body.appendChild(FileIoBrowserLocal.selector);
            FileIoBrowserLocal.selector.click();
        }
        // TODO: refactor to async function to be handled using promise, instead of using event target
        static save(_toSave) {
            for (let filename in _toSave) {
                let content = _toSave[filename];
                let blob = new Blob([content], { type: "text/plain" });
                let url = window.URL.createObjectURL(blob);
                //*/ using anchor element for download
                let downloader;
                downloader = document.createElement("a");
                downloader.setAttribute("href", url);
                downloader.setAttribute("download", filename);
                document.body.appendChild(downloader);
                downloader.click();
                document.body.removeChild(downloader);
                window.URL.revokeObjectURL(url);
            }
            let event = new CustomEvent("fileSaved" /* FILE_SAVED */, { detail: { mapFilenameToContent: _toSave } });
            FileIoBrowserLocal.targetStatic.dispatchEvent(event);
        }
        static async handleFileSelect(_event) {
            FudgeCore.Debug.fudge("-------------------------------- handleFileSelect");
            document.body.removeChild(FileIoBrowserLocal.selector);
            let fileList = _event.target.files;
            FudgeCore.Debug.fudge(fileList, fileList.length);
            if (fileList.length == 0)
                return;
            let loaded = {};
            await FileIoBrowserLocal.loadFiles(fileList, loaded);
            let event = new CustomEvent("fileLoaded" /* FILE_LOADED */, { detail: { mapFilenameToContent: loaded } });
            FileIoBrowserLocal.targetStatic.dispatchEvent(event);
        }
        static async loadFiles(_fileList, _loaded) {
            for (let file of _fileList) {
                const content = await new Response(file).text();
                _loaded[file.name] = content;
            }
        }
    }
    FudgeCore.FileIoBrowserLocal = FileIoBrowserLocal;
})(FudgeCore || (FudgeCore = {}));